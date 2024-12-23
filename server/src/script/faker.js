const { faker } = require("@faker-js/faker");
const { Book, BookGenre } = require("../models"); // Adjust path as needed

const seedBooks = async (numBooks, batchSize = 1000) => {
  try {
    const genres = [1, 2, 3, 4, 5, 6]; // Assuming these are genre IDs in the `genres` table
    const totalBatches = Math.ceil(numBooks / batchSize);

    for (let batch = 0; batch < totalBatches; batch++) {
      const books = [];
      const newBookData = [];
      //const bookGenres = [];

      for (let i = 0; i < batchSize && batch * batchSize + i < numBooks; i++) {
        // Create book data
        const bookData = {
          title: faker.lorem.words({ min: 2, max: 3 }),
          details: faker.lorem.paragraph(),
          thumbnailUrl: faker.image.url({
            width: 500,
            height: 450,
            category: "book",
          }),
          //thumbnailUrl: faker.image.url(),
          AuthorName: `${faker.person.firstName()} ${faker.person.lastName()}`,
          PublisherName: faker.company.name(),
          userId: faker.number.int({ min: 1, max: 5 }), // Assuming 10 users in the `users` table
        };

        newBookData.push(bookData);
      }

      // Bulk insert books
      const createdBooks = await Book.bulkCreate(newBookData, {
        returning: true,
      });

      // Assign genres to each book
      for (const book of createdBooks) {
        const numGenres = faker.number.int({ min: 1, max: 5 }); // Assign 1-5 genres per book
        const randomGenres = faker.helpers.arrayElements(genres, numGenres);

        for (const genreId of randomGenres) {
          await BookGenre.create({
            bookId: book.id,
            genreId,
          });
        }

        books.push(book);
      }

      console.log(
        `Batch ${batch + 1} of ${totalBatches} processed successfully.`
      );
    }

    console.log(`${numBooks} books seeded successfully.`);
  } catch (error) {
    console.error("Error seeding books:", error);
  }
};

seedBooks(10, 2);

// const { faker } = require("@faker-js/faker");
// const fs = require("fs");
// const path = require("path");
// const { Book, BookGenre } = require("../models"); // Adjust path as needed

// const seedBooks = async (numBooks, batchSize = 1000) => {
//   try {
//     const genres = [1, 2, 3, 4, 5, 6]; // Assuming these are genre IDs in the `genres` table
//     const totalBatches = Math.ceil(numBooks / batchSize);

//     // Path to your local image folder
//     const imageFolder = path.join(__dirname, "/images");
//     const imageFiles = fs.readdirSync(imageFolder).filter((file) => {
//       const ext = path.extname(file).toLowerCase();
//       return (
//         ext === ".jpg" || ext === ".png" || ext === ".jpeg" || ext === ".avif"
//       );
//     });

//     if (imageFiles.length === 0) {
//       console.error("No images found in the specified folder.");
//       return;
//     }

//     for (let batch = 0; batch < totalBatches; batch++) {
//       const books = [];
//       const newBookData = [];

//       for (let i = 0; i < batchSize && batch * batchSize + i < numBooks; i++) {
//         // Pick a random image
//         const randomImage = faker.helpers.arrayElement(imageFiles);

//         // Generate a URL for the image (adjust according to your static file setup)
//         const imageUrl = `http://localhost:3000/images/${randomImage}?width=400&height=300`;

//         // Create book data
//         const bookData = {
//           title: faker.lorem.words({ min: 2, max: 3 }),
//           details: faker.lorem.paragraph(),
//           thumbnailUrl: imageUrl,
//           AuthorName: `${faker.person.firstName()} ${faker.person.lastName()}`,
//           PublisherName: faker.company.name(),
//           userId: faker.number.int({ min: 1, max: 5 }), // Assuming 10 users in the `users` table
//         };

//         newBookData.push(bookData);
//       }

//       // Bulk insert books
//       const createdBooks = await Book.bulkCreate(newBookData, {
//         returning: true,
//       });

//       // Assign genres to each book
//       for (const book of createdBooks) {
//         const numGenres = faker.number.int({ min: 1, max: 5 }); // Assign 1-5 genres per book
//         const randomGenres = faker.helpers.arrayElements(genres, numGenres);

//         for (const genreId of randomGenres) {
//           await BookGenre.create({
//             bookId: book.id,
//             genreId,
//           });
//         }

//         books.push(book);
//       }

//       console.log(
//         `Batch ${batch + 1} of ${totalBatches} processed successfully.`
//       );
//     }

//     console.log(`${numBooks} books seeded successfully.`);
//   } catch (error) {
//     console.error("Error seeding books:", error);
//   }
// };

// seedBooks(10, 2);
