export function formatDate(date){

    return new Date(date).toLocaleDateString(
        "ru-RU"
    );

}

export function isUpcoming(status){

    return status==="upcoming";

}

export function isDone(status){

    return status==="completed";

}