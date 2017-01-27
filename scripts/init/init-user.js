// import User from '../../app/models/users/index';
// import Resume from '../../app/models/resumes/index';
//
// const initUser = async () => {
//   try {
//     await User.removeAll();
//     await Resume.removeAll();
//     const createResult = await User.createUser('wlec@outlook.com', '12345678');
//     const { success, message, result } = createResult;
//     if (success) {
//       const { _id, userName, email } = result;
//       await Resume.initialResume(_id, {
//         email,
//         name: userName
//       });
//       console.log(`Initial user finished. New user: ${_id} added.`);
//     } else {
//       console.log('Initial user failed.');
//     }
//   } catch (e) {
//     console.log(e);
//   }
// };
//
// export default initUser;
