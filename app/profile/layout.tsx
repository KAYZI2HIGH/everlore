import { Header } from "@/components/header";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="pt-20">
      {/* <AdvertBanner /> */}
      <Header maxwidth={true} />
      {children}
    </div>
  );
};

export default ProfileLayout;
