import { useState } from "react";
import styled from "styled-components";

export default function Entry() {
  const [selectedEntry, setSelectedEntry] = useState("expense");

  return (
    <Container>
      <Options>
        <Option
          selected={selectedEntry == "expense"}
          onClick={() => setSelectedEntry("expense")}
        >
          Single Expense
          {selectedEntry == "expense" && <SelectedDot></SelectedDot>}
        </Option>
        <Option
          selected={selectedEntry == "recurring"}
          onClick={() => setSelectedEntry("recurring")}
        >
          Recurring Expense
          {selectedEntry == "recurring" && <SelectedDot></SelectedDot>}
        </Option>
      </Options>
    </Container>
  );
}

const SelectedDot = styled.div`
  display: flex;
  align-items: center;
  width: 5px;
  height: 5px;
  border-radius: 8px;
  background-color: #53b5d9;
  position: absolute;
  bottom: -1rem;
  left: 50%;
  justify-content: center;
`;

const Options = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
`;

const Option = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: ${(props) => (props?.selected ? "#53B5D9" : "#959595")};
  position: relative;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;
