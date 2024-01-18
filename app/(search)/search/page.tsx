export default function QueryResultPage({ searchParams }: {
    searchParams?: {
        query?: string
    }
}) {
    return (
        <div>
            <h1>This page will show what you&apos;re looking for.</h1>
            {JSON.stringify(searchParams?.query)}
        </div>
    )
}
