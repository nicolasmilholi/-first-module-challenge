const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequest(request, response, next) {
  const { method, url } = request;

  const logRegister = `${method.toUpperCase()}] ${url}`

  console.log(logRegister)

  return next();
}

function validateRepotId(request, response, next) {

  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid ID Project' });
  }

  return next();
}


app.use(logRequest);
app.use('/repositories/:id', validateRepotId); 


app.get("/repositories", (request, response) => {
   return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0};

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {

  const { id } = request.params
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex(repository => repository.id == id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!' })
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes
  }
  repositories[repoIndex] = repository

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params
  const repoIndex = repositories.findIndex(repository => repository.id == id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!' })
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
 
  const { id } = request.params

  const repoIndex = repositories.findIndex(repository => repository.id == id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!' })
  }

  const repository = {
    id: repositories[repoIndex].id,
    title: repositories[repoIndex].title,
    url: repositories[repoIndex].url,
    techs: repositories[repoIndex].techs,
    likes: repositories[repoIndex].likes + 1
  }
  repositories[repoIndex] = repository

  return response.json(repository);

});

module.exports = app;
