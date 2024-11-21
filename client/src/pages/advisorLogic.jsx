
function getAdvisorEmail(studentBatch, studentId) {
    const id = parseInt(studentId, 10);
  
    switch (studentBatch) {
      case '20':
        if (id >= 2008001 && id <= 2008030) {
          return 'azad@cuet.ac.bd';
        }
        if (id >= 2008031 && id <= 2008060) {
          return 'saiful05eee@cuet.ac.bd';
        }
        break;
      case '21':
        if (id >= 2108001 && id <= 2108030) {
          return 'azad@cuet.ac.bd';
        }
        if (id >= 2108031 && id <= 2108060) {
          return 'saiful05eee@cuet.ac.bd';
        }
        break;
      default:
        // return 'advisor@cuet.ac.bd'; 
    }
  }
  
  export default getAdvisorEmail;
  