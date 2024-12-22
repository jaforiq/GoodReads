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
          title: faker.lorem.words({ min: 3, max: 6 }),
          details: faker.lorem.paragraph(),
          thumbnailUrl: faker.image.url(),
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

      // Bulk insert book-genre associations
      //await BookGenre.bulkCreate(bookGenres);

      console.log(
        `Batch ${batch + 1} of ${totalBatches} processed successfully.`
      );
    }

    console.log(`${numBooks} books seeded successfully.`);
  } catch (error) {
    console.error("Error seeding books:", error);
  }
};

// Usage: Call the function with the desired number of books and a batch size
seedBooks(10000, 1000);
