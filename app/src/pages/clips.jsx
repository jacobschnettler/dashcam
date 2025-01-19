import { useEffect, useState } from "react";
import { Navbar } from "../components";

import API from "../api";
import { Button } from "react-bootstrap";
import { DeleteClipModal } from "../modals";

export function ClipsPage() {
    const [Clips, setClips] = useState([])

    const [SelectedClip, setSelectedClip] = useState(null)

    const [ShowDeleteModal, setShowDeleteModal] = useState(false)

    function refreshClips() {
        API.get('/clips').then(function ({ data }) {
            if (data.error) return;

            setClips(data.clips);
        })
    }

    useEffect(refreshClips, [])

    return (
        <div>
            <Navbar />

            <div style={{ padding: '45px', width: '100%' }}>
                {Clips.length !== 0 ? (
                    Clips.map(function (clip) {
                        const clipDate = new Date(clip.date);

                        return clip.finished && (
                            <a href={`/clips/${clip.date}`}>
                                <div style={{ cursor: 'pointer', height: "500px", borderRadius: "8px", overflow: 'hidden', textAlign: 'center', position: 'relative', marginBottom: '50px' }}>
                                    <img
                                        src={`${process.env.REACT_APP_API}/${clip.thumbnail}`}
                                        style={{
                                            overflow: 'hidden',
                                            height: '100%',
                                            width: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />

                                    <div style={{
                                        position: 'absolute',
                                        bottom: '10px',
                                        left: '10px',
                                        color: 'white',
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.7)',
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        padding: '5px 10px',
                                        borderRadius: '4px',
                                    }}>
                                        {clip.length}
                                    </div>

                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        left: '10px',
                                        color: 'white',
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.7)',
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        padding: '5px 10px',
                                        borderRadius: '4px',
                                    }}>
                                        {clipDate.toLocaleString()}
                                    </div>

                                    <div style={{
                                        position: 'absolute',
                                        bottom: '10px',
                                        right: '10px',
                                        color: 'white',
                                        padding: '5px 10px',
                                    }}>
                                        <Button
                                            size='lg'
                                            variant='danger'
                                            onClick={function (e) {
                                                setSelectedClip(clip);
                                                setShowDeleteModal(true);
                                                e.preventDefault();
                                            }}
                                        >
                                            <h1 style={{ padding: "6px", fontSize: '25px' }}>
                                                <i class="fas fa-trash"></i>
                                            </h1>
                                        </Button>
                                    </div>
                                </div>
                            </a>
                        )
                    })
                ) : (
                    <div style={{ color: '#eee', textAlign: 'center', fontStyle: 'italic' }}>
                        <h1 className="h2">No Clips Found.</h1>

                        <p style={{ fontSize: '22px' }}>No clips present in the output folder.</p>
                    </div>
                )}
            </div>

            {SelectedClip && <DeleteClipModal show={ShowDeleteModal} setShow={setShowDeleteModal} clip={[SelectedClip, setSelectedClip]} onDelete={refreshClips} />}
        </div>
    );
}
