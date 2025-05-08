const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ2Njg2NDU3LCJpYXQiOjE3NDY2ODYxNTcsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImFjYjFiZDM4LWNhY2ItNDQwYy04MGU2LTIwNzViODE2MzhiNCIsInN1YiI6Im1hc2hvb2toa2hhbjc4NjJAZ21haWwuY29tIn0sImVtYWlsIjoibWFzaG9va2hraGFuNzg2MkBnbWFpbC5jb20iLCJuYW1lIjoibWFzaG9va2ggYWhtZWQga2hhbiIsInJvbGxObyI6IjIxMDQ5MjE1MzAwMjUiLCJhY2Nlc3NDb2RlIjoiYmFxaFdjIiwiY2xpZW50SUQiOiJhY2IxYmQzOC1jYWNiLTQ0MGMtODBlNi0yMDc1YjgxNjM4YjQiLCJjbGllbnRTZWNyZXQiOiJDUFJLSnhCSmdWcEJWVVBFIn0.L2ezvqpxxIM-cwb2BjlHbuMK92z2kM1IxieaLmv1adw';
const BASE_URL = 'http://20.244.56.144/evaluation-service';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
});
  

app.get("/users", async (req, res) => {
    try {
      const usersRes = await axiosInstance.get("/users");
      const users = usersRes.data.users;
  
      const commentCountPerUser = {};
  
      for (const userId of Object.keys(users)) {
        const postsRes = await axiosInstance.get(`/users/${userId}/posts`);
        const posts = postsRes.data.posts;
  
        let totalComments = 0;
  
        for (const post of posts) {
          const commentsRes = await axiosInstance.get(`/posts/${post.id}/comments`);
          totalComments += commentsRes.data.comments.length;
        }
  
        commentCountPerUser[userId] = totalComments;
      }
  
      const sortedUsers = Object.entries(commentCountPerUser)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id]) => users[id]);
  
      res.json({ topUsers: sortedUsers });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
});

app.get("/posts", async (req, res) => {
    const { type } = req.query;
  
    try {
      const usersRes = await axiosInstance.get("/users");
      const userIds = Object.keys(usersRes.data.users);
  
      let allPosts = [];
  
      for (const userId of userIds) {
        const postsRes = await axiosInstance.get(`/users/${userId}/posts`);
        allPosts.push(...postsRes.data.posts);
      }
  
      if (type === "latest") {
        allPosts.sort((a, b) => b.id - a.id);
        return res.json({ posts: allPosts.slice(0, 5) });
      } else if (type === "popular") {
        const postsWithComments = [];
  
        for (const post of allPosts) {
          const commentsRes = await axiosInstance.get(`/posts/${post.id}/comments`);
          postsWithComments.push({ ...post, commentCount: commentsRes.data.comments.length });
        }
  
        const maxComments = Math.max(...postsWithComments.map(p => p.commentCount));
        const mostCommented = postsWithComments.filter(p => p.commentCount === maxComments);
  
        return res.json({ posts: mostCommented });
      } else {
        return res.status(400).json({ error: "Invalid query param 'type'. Use 'latest' or 'popular'." });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
});

app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);
});