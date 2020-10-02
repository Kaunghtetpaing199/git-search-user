import React, { useState, useEffect, createContext } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GitContext = createContext();

const GitProvider = ({ children }) => {
  const [githubUser, serGithubUser] = useState(mockUser);
  const [githubRepos, serGithubRepos] = useState(mockRepos);
  const [githubFollowers, serGithubFollowers] = useState(mockFollowers);
  const [requests, setRequests] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({ show: false, msg: "" });
  const searchGithubUser = async (user) => {
    //toggle Error
    toggleError();
    //setLoading(true)

    setIsLoading(true);
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    );
    console.log(response);
    if (response) {
      serGithubUser(response.data);
      const { login, followers_url } = response.data;

      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${followers_url}?per_page=100`),
      ])
        .then((results) => {
          const [repos, followers] = results;
          const status = "fulfilled";
          if (repos.status === status) {
            serGithubRepos(repos.value.data);
          }
          if (followers.status === status) {
            serGithubFollowers(followers.value.data);
          }
        })
        .catch((err) => console.log(err));
    } else {
      toggleError(true, "there is no user with that username");
    }
    checkRequests();
    setIsLoading(false);
  };

  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data;
        setRequests(remaining);
        if (remaining === 0) {
          toggleError(true, "you have exeeded your hourly rate limit");
        }
      })
      .catch((err) => console.log(err));
  };

  //error
  function toggleError(show = false, msg = "") {
    setError({ show, msg });
  }

  useEffect(() => {
    checkRequests();
  }, []);

  return (
    <React.Fragment>
      <GitContext.Provider
        value={{
          githubUser,
          githubRepos,
          githubFollowers,
          requests,
          isLoading,
          error,
          searchGithubUser,
        }}
      >
        {children}
      </GitContext.Provider>
    </React.Fragment>
  );
};

export { GitProvider, GitContext };
