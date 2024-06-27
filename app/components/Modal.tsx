export default function Modal({
  children,
  show = false,
  id = "default",
  canClose = false,
}: Readonly<{
  children: React.ReactNode;
  show?: boolean;
  id: string;
  canClose: boolean;
}>) {
  return (
    <dialog
      id={id}
      className={
        "modal modal-bottom sm:modal-middle " + (show ? "modal-open" : "")
      }
    >
      <div className="modal-box">{children}</div>
      {canClose && (
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      )}
    </dialog>
  );
}
