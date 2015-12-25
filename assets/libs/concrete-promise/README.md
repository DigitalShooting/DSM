## About Promise

Promise is a simple library allowing you to easily create your own promise
callbacks. This helps you implement the Promise Programming Pattern in
JavaScript.

This incarnation differs from the when().then() syntax proposed by
[Promises/A+](http://promisesaplus.com/). This library assumes you are dealing
with object oriented programming, so all callbacks are executed with a certain
context, setting the value of `this` in the callback function. Secondly, it
encourages the creation of concrete sub classes. Lastly, it gives you a way to
express what things can go right and what things can go wrong when an
asynchronous operation is invoked.

## Getting Started

First, download or clone from GitHub, or install through Bower:

Bower: `bower install concrete-promise`

Git: `git clone https://github.com/gburghardt/promise.git`

Download: https://github.com/gburghardt/promise/archive/master.zip

Then load `demo/index.html` in any browser.

## A quick and dirty example

    blogPost.save()
        .context(this)
        .saved(function(response, xhr) {
            console.log("Saved!");
        })
        .invalid(function(xhr) {
            console.warn("Oops, validation errors. Try again.");
        })
        .failure(function(xhr) {
            console.error("Blam-O! Nothing you can do. The wheel is spinning, but the hamster is dead.");
        })
        .complete(function() {
            console.log("Done!");
        });

Just by looking at this, you can see what codes gets executed and why it's being
invoked. The "saved" callback means you've saved the blog post successfully. The
"invalid" callback means the server didn't blow up, but maybe you forgot to
enter the blog post title and the user can recover from this. The "failure"
callback means something catastrophic did go wrong, and maybe the user cannot
recover from this. Finally, the "complete" callback always gets called no matter
which of the other callbacks are invoked.

Compare that to:

    blogPost.save()
        .then(
            function() {
                // yay!
            },
            function() {
                // boo...
            }
        );

Only if you know the Promise/A+ implementation of the Promise Pattern would you
know that the first function is the "success" handler, and the second function
is the "error" handler. But what is the error? Is the error recoverable by the
user? What if I want a function that gets executed regardless of whether or not
it was a success or failure but I don't want the execution chain to continue?
And God forbid you should want to use the `this` variable in the callbacks.

### Implementing your specific promise

When creating your own promise, start by thinking of the criteria that defines
success, and the ways this asynchronous operation can fail.

What is the "Happy Path?"

- **saved:** You saved the blog post. Continue on with your life.

What are the "Unhappy Paths?"

- **invalid:** Nothing terrible went wrong. Just correct your mistakes and
  resave.
- **failure:** You didn't do anything wrong, and what did go wrong can't be
  corrected by you.
- **complete:** Whether success, failure or invalidity, now we are done with
  this operation, so perform some cleanup work.

Create your promise class:

    var SavePromise = Promise.create([
        "saved",
        "invalid",
        "failure",
        "complete"
    ]);

Use the promise:

    BlogPost = function() {
        this.title = "";
    };

    BlogPost.prototype.save = function() {
        var promise = new SavePromise(this);

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (this.readyState !== 4) { return; }

            if (this.status === 200 || this.status === 201) {
                promise
                    .fulfill("saved", this)
                    .fulfill("complete", this);
            }
            else if (this.status === 422) {
                promise
                    .fulfill("invalid", JSON.parse(this.responseText), this)
                    .fulfill("complete", this);
            }
            else if (this.status >= 400) {
                promise
                    .fulfill("failure", this)
                    .fulfill("complete", this);
            }
        };

        // ... set up AJAX request

        xhr.send();

        return promise;
    };

Invoke the promise:

    var blogPost = new BlogPost();
    blogPost.title = "Testing";

    // save the blog post, which returns a SavePromise...
    blogPost.save()
        .context(this)
        .saved(function(xhr, promiser) {
            // tell user their blog post was saved
        })
        .invalid(function(errors, xhr, promiser) {
            // show form field errors
        })
        .failure(function(xhr, promiser) {
            // show general error message
        })
        .complete(function() {
            // clean up work
            blogPost = null;
        });

Your asynchronous code is more readable and easier to maintain because the
success and failure criteria makes sense based on the use case. Error handling
is not an exact science, but this incarnation of the Promise Pattern can help
you tame it.
