const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

const BASE_URL = 'http://20.244.56.144/evaluation-service';

app.get('/users', async (req, res) => {
    try {
      const usersRes = await axios.get(`${BASE_URL}/users`);
      const users = usersRes.data.users;
  
      const commentCountByUser = {};
      await Promise.all(Object.keys(users).map(async (userId) => {
        const postsRes = await axios.get(`${BASE_URL}/users/${userId}/posts`);
        const posts = postsRes.data.posts;
        let totalComments = 0;
        await Promise.all(posts.map(async (post) => {
          const commentsRes = await axios.get(`${BASE_URL}/posts/${post.id}/comments`);
          totalComments += commentsRes.data.comments.length;
        }));
        commentCountByUser[userId] = totalComments;
      }));
  
      const topUsers = Object.entries(commentCountByUser)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([userId]) => ({ id: userId, name: users[userId] }));
  
      res.json(topUsers);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch top users' });
    }
  });