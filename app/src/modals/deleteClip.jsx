import { Button, Modal } from "react-bootstrap";

import API from "../api";

export function DeleteClipModal({ show, setShow, clip, onDelete }) {
    const handleClose = () => setShow(false);

    const [ClipData, setClipData] = clip

    function deleteClip() {
        API.get('/delete', {
            params: {
                clip: ClipData.date
            }
        }).then(function (data) {
            if (data.status !== 200) return

            handleClose();

            if (onDelete) {
                onDelete();
            }
        })
    }

    return show && (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Clip</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this clip?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="danger" onClick={deleteClip}>
                    Delete Clip
                </Button>
            </Modal.Footer>
        </Modal>
    )
}