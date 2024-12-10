const Modal = ({children, modalRef, setModal}) => {

    document.addEventListener("click", (e) => {
        detectClickOutsideModal(e)
    }, true)

    const detectClickOutsideModal = (e) => {
        const modalElement = modalRef.current
        if(modalElement && !modalElement.contains(e.target)){
            setModal(false)
        }
    }

    return <div 
    className="modal" 
    ref={modalRef}>
        <div className="modalContent">
            {children}
        </div>
    </div>
}

export default Modal;