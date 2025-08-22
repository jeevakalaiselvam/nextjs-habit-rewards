import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { TbCircleChevronRight } from "react-icons/tb";

export default function Main() {
  const [userName, setUserName] = useState("");
  const [userDept, setUserDept] = useState("");
  const [courses, setCourses] = useState([]);
  const [coursesRegisterd, setCoursesRegistered] = useState([]);
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

  const registerCourseForUser = (course, user) => {
    try {
      axios
        .post("/api/register", { courseId: course?._id, userId: userName })
        .then((response) => {
          refreshAll();
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

  const refreshCourseRegistered = () => {
    try {
      axios.get("/api/register").then((response) => {
        const courses = response?.data;
        setCoursesRegistered(courses);
      });
    } catch (e) {}
  };

  const refreshAll = () => {
    refreshCourse();
    refreshCourseRegistered();
  };

  console.log(courses, coursesRegisterd);

  return (
    <Container>
      <button
        style={{ color: "#333", cursor: "pointer" }}
        onClick={() => {
          refreshAll();
        }}
      >
        FETCH
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
            <th style={{ width: "200px", textAlign: "center" }}>Actions</th>
          </tr>
          {courses
            ?.filter((course) => {
              return (
                !course?.exclude?.includes(userDept) || userName?.length == 0
              );
            })
            ?.map((course, index) => {
              return (
                <tr>
                  <td style={{ width: "200px", textAlign: "center" }}>
                    {index}
                  </td>
                  <td style={{ width: "200px", textAlign: "center" }}>
                    {course?.name}
                  </td>
                  <td style={{ width: "200px", textAlign: "center" }}>
                    {course?.exclude}
                  </td>{" "}
                  <td style={{ width: "200px", textAlign: "center" }}>
                    {course?.count -
                      coursesRegisterd?.filter(
                        (inner) => inner?.courseId == course?._id
                      )?.length}
                  </td>
                  <td style={{ width: "200px", textAlign: "center" }}>
                    {coursesRegisterd?.filter(
                      (inner) => inner?.userId == userName
                    )?.length == 0 && (
                      <span
                        style={{ color: "green", cursor: "pointer" }}
                        onClick={() => {
                          registerCourseForUser(course, userName);
                        }}
                      >
                        <TbCircleChevronRight />
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
        </table>
        {coursesRegisterd?.filter((inner) => inner?.userId == userName)
          ?.length != 0 && (
          <RegisteredBox>
            {userName} already registered for{" "}
            {JSON.stringify(
              courses?.find(
                (course) =>
                  course?._id ==
                  coursesRegisterd?.filter((course) => {
                    return course?.userId == userName;
                  })?.[0]?.courseId
              )?.name
            )}
          </RegisteredBox>
        )}
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

const RegisteredBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

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
