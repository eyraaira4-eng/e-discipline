<!-- Include Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>

<script>
  // ===============================
  // Firebase config (paste awak punya)
  // ===============================
  const firebaseConfig = {
    apiKey: "AIzaSyA8KlEVnvOYYcvZ1ET27BN-SiABP-4_A00",
    authDomain: "e-discipline-44486.firebaseapp.com",
    projectId: "e-discipline-44486",
    storageBucket: "e-discipline-44486.firebasestorage.app",
    messagingSenderId: "304449597658",
    appId: "1:304449597658:web:cbdadd79f19383d2d2b5e3",
    measurementId: "G-L13Z9GGCFV"
  };

  // ===============================
  // Initialize Firebase
  // ===============================
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const auth = firebase.auth(); // optional jika nak pakai Auth Firebase

  // ===============================
  // Loading screen
  // ===============================
  window.addEventListener('load', () => {
    setTimeout(()=>{
      document.getElementById('loadingScreen').classList.add('hidden');
      document.getElementById('signupForm').classList.add('active');
    }, 2000);
  });

  // ===============================
  // Switch form (Sign Up / Log In)
  // ===============================
  function switchForm(formId) {
    document.querySelectorAll('.form-container').forEach(f=>f.classList.remove('active'));
    document.getElementById(formId).classList.add('active');
  }

  // ===============================
  // Sign Up
  // ===============================
  document.querySelector('#signupForm form').addEventListener('submit', async function(e){
    e.preventDefault();
    const school = document.getElementById('signupSchool').value;
    const code = document.getElementById('signupCode').value;
    const password = document.getElementById('signupPassword').value;

    try {
      // Simpan user ke Firestore
      await db.collection('users').doc(code).set({
        school,
        code,
        password
      });
      alert('Sign Up berjaya!');
      switchForm('roleSelection');
    } catch(err){
      console.error(err);
      alert('Error Sign Up');
    }
  });

  // ===============================
  // Log In
  // ===============================
  document.querySelector('#loginForm form').addEventListener('submit', async function(e){
    e.preventDefault();
    const code = document.getElementById('loginCode').value;
    const password = document.getElementById('loginPassword').value;

    try {
      const doc = await db.collection('users').doc(code).get();
      if(doc.exists){
        const data = doc.data();
        if(data.password === password){
          switchForm('roleSelection');
        } else {
          alert('Password salah!');
        }
      } else {
        alert('Code tidak ditemui!');
      }
    } catch(err){
      console.error(err);
      alert('Error Log In');
    }
  });

  // ===============================
  // Role selection
  // ===============================
  let currentRole = '';
  function selectRole(role){
    currentRole = role;
    if(role === 'Pengawas'){
      // <-- Tukar password pengawas sebenar di sini
      const password = prompt('Masukkan password pengawas:');
      if(password !== '1234'){ alert('Password salah!'); return; }
    }
    switchForm('scannerContainer');
  }

  // ===============================
  // Demo student database (boleh ganti Firestore nanti)
  // ===============================
  const students = [
    {name:'Ali', ic:'90010101', class:'1A'},
    {name:'Aina', ic:'90020202', class:'1B'},
    {name:'Ahmad', ic:'90030303', class:'1A'}
  ];

  let currentStudent = null;

  function scanStudent(){
    // Simulate scan
    currentStudent = students[Math.floor(Math.random()*students.length)];
    showStudentProfile(currentStudent);
  }

  function confirmIC(){
    const ic = document.getElementById('backupIC').value;
    const student = students.find(s=>s.ic===ic);
    if(student){
      currentStudent = student;
      showStudentProfile(student);
    } else { alert('Pelajar tidak ditemui!'); }
  }

  function showStudentProfile(student){
    document.getElementById('studentName').innerText = student.name;
    document.getElementById('studentClass').innerText = student.class;
    document.getElementById('studentIC').innerText = student.ic;
    switchForm('studentProfile');
  }

  // ===============================
  // Submit Kesalahan → Firestore
  // ===============================
  function submitViolation(){
    const violation = document.getElementById('studentViolation').value;
    if(!violation){ alert('Sila isi kesalahan!'); return; }

    const now = new Date();
    const record = {
      studentIC: currentStudent.ic,
      studentName: currentStudent.name,
      studentClass: currentStudent.class,
      violation,
      recordedBy: currentRole,
      timestamp: now.toISOString()
    };

    db.collection('violations').add(record)
      .then(()=> {
        alert('Kesalahan disimpan di Firebase!');
        document.getElementById('studentViolation').value='';
        document.getElementById('backupIC').value='';
        switchForm('scannerContainer');
      })
      .catch(err=> { console.error(err); alert('Error simpan kesalahan'); });
  }

</script>
