import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

export default function Main() {
  const [userName, setUserName] = useState("");
  const [userDept, setUserDept] = useState("");
  const [courses, setCourses] = useState([]);
  const [courseForm, setCourseForm] = useState({
    name: "",
    exclude: "",
    count: "0",
  });

  const createCourse = () => {
    try {
      console.log(courseForm);
      axios.post("/api/createCourse", { ...courseForm }).then((response) => {
        refreshCourse();
      });
    } catch (e) {}
  };

  const checkUserRole = (userName) => {
    try {
      axios.get(`/api/role?user=${userName}`).then((response) => {
        const dept = response?.data?.department;
        setUserDept(dept);
      });
    } catch (e) {}
  };

  const refreshCourse = () => {
    try {
      axios.get("/api/course").then((response) => {
        const course = response?.data;
        setCourses(course);
      });
    } catch (e) {}
  };

  return (
    <Container>
      <button
        style={{ color: "#333", cursor: "pointer" }}
        onClick={() => {
          refreshCourse();
        }}
      >
        UPDATE
      </button>
      <Left>
        <input
          style={{ color: "#333", cursor: "pointer" }}
          type="text"
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
          }}
        />
        <button
          style={{ color: "#333", cursor: "pointer" }}
          onClick={() => {
            checkUserRole(userName);
          }}
        >
          CHECK
        </button>
      </Left>
      <Content>
        <table>
          <tr>
            <th style={{ width: "200px", textAlign: "center" }}>Id</th>
            <th style={{ width: "200px", textAlign: "center" }}>Name</th>
            <th style={{ width: "200px", textAlign: "center" }}>Exclude</th>
            <th style={{ width: "200px", textAlign: "center" }}>Count</th>
          </tr>
          {courses?.map((course, index) => {
            return (
              <tr>
                <td style={{ width: "200px", textAlign: "center" }}>{index}</td>
                <td style={{ width: "200px", textAlign: "center" }}>
                  {course?.name}
                </td>
                <td style={{ width: "200px", textAlign: "center" }}>
                  {course?.exclude}
                </td>{" "}
                <td style={{ width: "200px", textAlign: "center" }}>
                  {course?.count}
                </td>
              </tr>
            );
          })}
        </table>
        <br />
        <br />
        <br />
        <br />
        <input
          style={{ color: "#333", cursor: "pointer" }}
          type="text"
          value={courseForm?.name}
          onChange={(e) => {
            setCourseForm((old) => ({ ...old, name: e.target.value }));
          }}
        />
        <input
          style={{ color: "#333", cursor: "pointer" }}
          type="text"
          value={courseForm?.exclude}
          onChange={(e) => {
            setCourseForm((old) => ({ ...old, exclude: e.target.value }));
          }}
        />
        <input
          style={{ color: "#333", cursor: "pointer" }}
          type="number"
          min={10}
          max={100}
          value={courseForm?.count}
          onChange={(e) => {
            setCourseForm((old) => ({ ...old, count: Number(e.target.value) }));
          }}
        />
        <button
          style={{ color: "#333", cursor: "pointer" }}
          onClick={() => {
            createCourse();
          }}
        >
          ADD
        </button>
      </Content>
    </Container>
  );
}

const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 300px;
  min-height: 100vh;
  max-height: 100vh;
  padding: 1rem;
  flex-direction: column;
  background-color: #111923;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  min-height: 100vh;
  max-height: 100vh;
  padding: 1rem;
  flex-direction: column;
  background-color: #1b2838;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100vw;
  max-width: 100vw;
  min-height: 100vh;
  max-height: 100vh;
  color: #fefefe;
`;
