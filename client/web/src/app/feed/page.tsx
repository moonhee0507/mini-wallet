"use client";

export default function Page() {
  const onClickCreateWallet = () => {
    console.log("create wallet");
  };
  const onClickImportWallet = () => {
    console.log("import wallet");
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 bg-background h-screen w-screen">
      <button className="btn-lg btn-primary max-w-lg w-full" onClick={onClickCreateWallet}>Create wallet</button>
      <button className="btn-lg btn-primary max-w-lg w-full" onClick={onClickImportWallet}>Import wallet</button>
    </div>
  );
}