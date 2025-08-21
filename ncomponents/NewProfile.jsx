import styled from 'styled-components';

export default function NewProfile() {
  return (
    <Container>
      <Profile></Profile>
      <Name>
        <span style={{ color: '#3DB1F0', fontSize: '.9rem', height: '20px' }}>
          NotRealLogan
        </span>
        <span style={{ fontSize: '.8rem', height: '20px' }}>All Library</span>
      </Name>
    </Container>
  );
}

const Profile = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 50px;
  height: 50px;
  background: url('https://blog.bioware.com/wp-content/uploads/2015/10/TwitterProfile.png');
  background-size: contain;
  background-repeat: no-repeat;
`;

const Name = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  padding-left: 1rem;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 1rem;
`;
