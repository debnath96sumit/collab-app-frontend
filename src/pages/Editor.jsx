import EditorHeader from '../components/editor/EditorHeader';
import EditorSidebar from '../components/editor/EditorSidebar';
import EditorToolbar from '../components/editor/EditorToolbar';
import EditorCanvas from '../components/editor/EditorCanvas';
import CollabPanel from '../components/editor/CollabPanel';

const Editor = () => {
    // doc state
    // socket state
    // presence state
    // save status state
    // collab panel open/close state

    return (
        <div className="bg-background text-on-surface h-screen w-screen overflow-hidden flex flex-col">
            <EditorHeader />

            <div className="flex flex-1 overflow-hidden">
                <EditorSidebar />

                <main className="flex-1 bg-surface-dim flex flex-col items-center overflow-hidden relative">
                    <EditorToolbar />

                    <div className="flex-1 w-full max-w-4xl px-12 overflow-y-auto">
                        <EditorCanvas />
                    </div>
                </main>

                <CollabPanel />
            </div>
        </div>
    );
};

export default Editor;