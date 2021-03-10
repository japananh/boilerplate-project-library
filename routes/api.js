/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
const { isValidObjectId } = require("mongoose");
const Library = require("../models");

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async function (_req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      // Solution 1: use toObject()
      // const books = await Library.find({}, (err, docs) => {
      //   if (err) res.send("server error");
      //   const books = docs.map((book) => ({
      //     ...book.toObject(),
      //     commentcount: book.toObject().comments.length
      //   }));
      //   res.send(
      //     books
      //   );
      // });
      
      // Solution 2: use lean() will return _doc instead of whole document
      const books = await Library.find({}).lean();
      res.send(
        books.map((book) => ({
          ...book,
          commentcount: book.comments.length,
        }))
      );
    })

    .post(async function (req, res) {
      //response will contain new book object including atleast _id and title
      const title = req.body.title;

      if (!title) return res.json('missing required field title');
      
      const book = await Library.create({ title });
      
      res.send(book);
    })

    .delete(async function (_req, res) {
      await Library.deleteMany({});
      //if successful response will be 'complete delete successful'
      res.json("complete delete successful");
    });

  app
    .route("/api/books/:id")
    .get(async function (req, res) {
      const bookId = req.params.id;

      if (!bookId || !isValidObjectId(bookId)) return res.json('no book exists');

      const book = await Library.findById(bookId);

      if (!book) {
        return res.json('no book exists');
      }

      //json res format: {"_id": bookId, "title": book_title, "comments": [comment,comment,...]}
      res.json(book);
    })

    .post(async function (req, res) {
      let bookId = req.params.id;
      let comment = req.body.comment;
      
      if (!bookId || !isValidObjectId(bookId)) return res.json('no book exists');
      if (!comment) return res.json('missing required field comment');

      const updatedBook = await Library.findOneAndUpdate(
        { _id: bookId },
        { $push: {
          'comments': comment
        }},
        { new: true }
      ).lean();
      
      if (!updatedBook) {
        return res.json('no book exists');
      }

      //json res format same as .get
      res.json({ ...updatedBook, commentcount: updatedBook.comments.length });
    })

    .delete(async function (req, res) {
      const bookId = req.params.id;
      
      if (!bookId || !isValidObjectId(bookId)) return res.json('no book exists');

      const book = await Library.findOne({ _id: bookId });
      if (!book) {
        res.json("no book exists");
      }

      await Library.deleteOne({_id: bookId });
      
      //if successful response will be 'delete successful'
      res.json('delete successful');
    });
};
