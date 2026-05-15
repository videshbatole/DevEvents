"use client";

import { useState } from "react";

const BookEvent = () => {
  const [email, setEmail] = useState<string>("");
  const [isSubmited, setIsSubmited] = useState<boolean>(false);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTimeout(() => {
      setIsSubmited(true);
    }, 1000);
  };

  return (
    <div id="book-event">
      {isSubmited ? (
        <p className="text-sm">Thank You for Siginig up</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              placeholder="Enter Your Email Address"
            />
            <button type="submit" className="button-submit">
              submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BookEvent;
