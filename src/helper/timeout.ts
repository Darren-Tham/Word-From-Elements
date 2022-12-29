/**
 * Sleeps program that uses asynchronous Promise
 * in a setTimeout
 * 
 * The new Promise that is returned should be awaited
 * by the programmer
 * 
 * @param time - number in milliseconds 
 * @returns a new Promise that should be awaited
 */
export default function timeout(
    time: number
)
{
    return new Promise(res => setTimeout(res, time))
}