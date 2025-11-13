// 연습용 데이터
const students = [
  { id: 1, name: "김철수", age: 20, grade: "A" },
  { id: 2, name: "이영희", age: 22, grade: "B" },
  { id: 3, name: "박민수", age: 21, grade: "A" },
  { id: 4, name: "정수진", age: 23, grade: "C" },
];

const student = students.find((s) => s.id === 2);
console.log("ID가 2인 학생 : ", student);

const agradestudent = students.filter((s) => s.grade === "A");
console.log("A학점인 학생:", agradestudent);

const names = students.map((s) => s.name);
console.log("학생이름들:", names);

const index = students.findIndex((s) => s.id === 3);
console.log("id가 3인 학생의 index :", index);

console.log("push전 학생 수 : ", students.length, "명 입니다.");

const push = students.push({ id: 5, name: "윤기훈", age: 22, grade: "A+" });
console.log("push후 학생 수 : ", students.length, "명 입니다.");

const newnames = students.map((s) => s.name);
console.log("추가 후 학생 이름들:", newnames);
