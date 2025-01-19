import { useEffect, useState } from "react"

import API from "../api"
import { Navbar } from "../components"
import { Button } from "react-bootstrap"
import { DeleteClipModal } from "../modals"

export function EditClipPage() {
    const [ClipData, setClipData] = useState(null);

    const [ShowDeleteModal, setShowDeleteModal] = useState(false)

    useEffect(function () {
        const split = window.location.pathname.split('/')

        if (split.length != 3) return window.location.href = '/clips'

        const clip = split[2]

        API.get('/fetch', {
            params: {
                clip
            }
        }).then(function ({ data }) {
            if (data && data.metadata)
                setClipData(data.metadata);
        })
    }, [])

    return (
        <div>
            <Navbar />

            {ClipData && (
                <div style={{ width: '100%', textAlign: 'center', padding: "45px" }}>
                    <video width={1920 * 0.6} height={1080 * 0.6} controls>
                        <source src={`${process.env.REACT_APP_API}/${ClipData.video}`} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    <div style={{ padding: '25px' }}>
                        <Button
                            size='lg'
                            style={{ padding: '15px', margin: '10px' }}
                            href={`${process.env.REACT_APP_API}/api/download?clip=${ClipData.date}`}
                            download="clip.mp4"
                        >
                            <i className="fas fa-download"></i> Download
                        </Button>
                        <Button
                            size='lg'
                            variant="danger"
                            style={{ padding: '15px', margin: '10px' }}
                            onClick={function () {
                                setShowDeleteModal(true)
                            }}
                        >
                            <i className="fas fa-trash"></i> Delete
                        </Button>
                    </div>
                </div>
            )}

            <DeleteClipModal show={ShowDeleteModal} setShow={setShowDeleteModal} clip={[ClipData, setClipData]} onDelete={() => window.location.href = '/clips'} />
        </div>
    )
}