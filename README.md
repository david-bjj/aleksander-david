# aleksander-david

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

You can find file for importing the request for testing the application that is called project-demo-requests.json

Also some demo requests 

// Create member
http://localhost:3000/register
{
    "name": "Shafeeq",
    "email": "shafeeq@test.com",
    "phone": "123456789",
    "address": "Dobrich, BUL"
}

// Get all members
http://localhost:3000/members

// Get member
http://localhost:3000/members/11

// Get all books
http://localhost:3000/books

// Get book
http://localhost:3000/books/1

// Create book
http://localhost:3000/books

{
    "title": "David",
    "subject": "David 1",
    "author": "David",
    "language": "English"
}

// Get issues 
http://localhost:3000/issues

// Get specific member's issue 
http://localhost:3000/members/1/issues

// Delete 
http://localhost:3000/issues/1

// Create specific issue for a member with a given book
http://localhost:3000/issues/1

{
    "memberId": 1,
    "bookId": 1
}

This project was created using `bun init` in bun v1.3.14. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
