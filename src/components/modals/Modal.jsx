import { useEffect } from "react"

const Modal = ({children, modalRef, setModal}) => {

    const detectClickOutsideModal = (e) => {
        const modalElement = modalRef.current
        console.log(modalElement, e.target)
        if(modalElement && !modalElement.contains(e.target)){
            setModal(false)
        }
    }

    useEffect(() => {
        document.addEventListener("click", (e) => {
            detectClickOutsideModal(e)
        }, true)
        return () => {
            // Removes the event listener when unmounted
            document.removeEventListener("click", detectClickOutsideModal, true);
        }
    }, [modalRef, setModal])

    return (
        <div className="modal">
            <div className="modalContent">
                {children}
            </div>
        </div>
    )
}

export default Modal;