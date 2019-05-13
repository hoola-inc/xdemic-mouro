export type headersType={
    "Authorization": string
}

export type eventType = {
    headers: headersType
}

export type contextType = {
    functionName: string
}

export type eventContextType = {
    event: eventType,
    context: contextType
}