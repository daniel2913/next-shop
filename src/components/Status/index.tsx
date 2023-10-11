import dbConnect from '../../lib/dbConnect'

export default async function Status({ con }: { con: any }) {
    return (
        <>
            <div>{con}</div>
        </>
    )
}
