import Profile from "@/app/profile/profile";
import { auth } from "@/auth.config";



const newAccount = async() => {
  const session = await auth();

  return (
    <>
      <div className="container">
        
        <div className="py-32">
        <h1 className="text-semibold text-lg">Welcome to your new Account in Alanis.dev!</h1>
        <h2 className="py-6">Your new account was created succesfully:</h2>
        <Profile user={session.user} />
        </div>
 </div>
    </>
  );
};

export default newAccount;
