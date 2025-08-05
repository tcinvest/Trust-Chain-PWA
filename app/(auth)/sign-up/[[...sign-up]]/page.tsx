// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";
import ReferralCodeHandler from "@/components/ReferralCodeHandler";

export default async function Page({ 
  searchParams 
}: { 
  searchParams: Promise<{ ref?: string }> 
}) {
  const resolvedSearchParams = await searchParams;
  
  console.log("Referral code:", resolvedSearchParams.ref);
  
  return (
    <div className="flex justify-center pt-4">
      <ReferralCodeHandler />
      <SignUp />
    </div>
  );
}