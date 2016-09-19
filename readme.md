# Quick Attempt at backend challenge

Hi, The League! This is my 4 hour approach to the Node.js challenge. Naturally, there are a million things I probably should have done differently, but I thought I'd tell you about my approach. 

Started: 11 am, Saturday. Completed: 6 pm, Sunday.

Readme written and project deployed on Monday.

----

### Take 1

First, I started out by trying to write absolutely everything from scratch. 

I started by thinking about what my user object would be, and I started out with the basic properties that they would have: 

```
user: {
	username:
	password:
	age:
	gender:
}
```
and so on. I was relatively happy with that setup until I started approaching the search. 

Now, I clearly understand that the search preferences ought to have been my starting place. In order to limit the search results, I needed to know what my user's preferences were. <strong>While there are several ways to handle the preferences within a relational system, I would have preferred to use a NoSQL framework if I tried again. </strong>

After about 1.5 hours of working from scratch, I realized that I wasn't satisfied with the direction I was heading. What I really wanted was to have a strong notion of a session, where the user's information would always be passed on securely in each communication between server and client. 

I started over.

----

### Take 2

Adapting an existing CRUD skeleton I'd written before, I started over, using Passport.js and BCRYPT to use browser sessions to keep a persistent track of whether a user is logged in or out. This way, a given user could only edit their own information, and the server would have easy access to their preferences through a user object in the header. 

For my own sake, I used a super lightweight frontend to test my information while I was developing. It's the methodology I'm most used to right now. 

Now, users have their preferences bound up in their account information. Signup and login are working nicely, and the search currently filters out the user from results as well as gender preference.

----

### Takeaway

The search isn't as robust as I would like. I've only used manual JavaScript filters, when I should have written a more rigorous Postgres query. 

On the other hand, I'm proud of the session I wrote in, and I have password encryption and decryption built into my authentication process. 

I know it is supposed to be a simple challenge, but it took a lot of restraint on my part to stop working and reworking on this solution. In twice as much time, I think I would have a really nice setup, and it would be rewarding to see it all snap together in the frontend as well. 

