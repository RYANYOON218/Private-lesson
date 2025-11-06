const express = require('express');
const app = express();
const PORT = 3000;
app.use(express.json());
// 가짜 데이터베이스 (배열에 할 일 목록 저장)
let todos = [
{ id: 1, task: "JavaScript 기초 공부하기"
, completed: false },
{ id: 2, task: "Express 튜토리얼 따라하기"
, completed: false },
{ id: 3, task: "첫 API 만들기"
, completed: true }
];
// 홈 페이지
app.get('/'
, (req, res) => {
res.send('할 일 관리 API에 오신 것을 환영합니다!');
});
// ===== 여기서부터 새로운 코드 =====
// 1. 모든 할 일 조회하기
app.get('/todos'
, (req, res) => {
res.json(todos);
});
// 2. 특정 할 일 조회하기 (ID로 찾기)
app.get('/todos/:id'
, (req, res) => {
// URL에서 ID 가져오기
const id = parseInt(req.params.id);
// ID로 할 일 찾기
const todo = todos.find(t => t.id === id);
// 할 일을 찾았나요?
if (todo) {
res.json(todo);
} else {
res.status(404).json({ message: "할 일을 찾을 수 없습니다" });
}
});
app.listen(PORT, () => {
console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다!`);
});

// 3. 새로운 할 일 추가하기
app.post('/todos'
, (req, res) => {
// 요청 본문에서 데이터 가져오기
const { task } = req.body;
// task가 비어있는지 확인
if (!task) {
return res.status(400).json({
message: "할 일 내용을 입력해주세요"
});
}
// 새로운 할 일 객체 만들기
const newTodo = {
id: todos.length + 1, // 간단한 ID 생성
task: task,
completed: false
};
// 배열에 추가
todos.push(newTodo);
// 생성된 할 일 응답
res.status(201).json(newTodo);
});