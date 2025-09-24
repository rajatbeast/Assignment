// clone repository and dependencies
git clone https://github.com/rajatbeast/Assignment.git
cd assignment
npm install

// create a .env file for mongodb url and jwt secret key
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/assignment_portal
JWT_SECRET=super_secret_key_here

// run server
npm run start
server will start on http://localhost:5000/api

// Api Endpoints
POST /api/register → Register a user (teacher/student)
POST /api/login → Login & get JWT

POST /api/assignments → Create new assignment
PATCH /api/assignments/:id → Update assignment / change status
DELETE /api/assignments/:id → Delete
GET /api/assignments → List assignments (filter by status, pagination)

POST /api/submissions/:assignmentId → Student submits answer
GET /api/submissions/assignment/:assignmentId → Teacher views submissions
GET /api/submissions/me/:assignmentId → Student views their own submission
PATCH /api/submissions/review/:submissionId → Teacher marks submission reviewed
