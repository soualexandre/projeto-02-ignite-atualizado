import { differenceInMilliseconds } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { CyclesContext } from "../..";
import { CountDownContainer, Separator } from "./styles";

export function CountDown() {
    const { activeCycle, activeCycleId, MarkCurrentCycleAsFinished, setSecondsPassed, amoutSecondsPassed } = useContext(CyclesContext);

    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0


    const currentSeconds = activeCycle ? totalSeconds - amoutSecondsPassed : 0

    const minutesAmount = Math.floor(currentSeconds / 60)
    const secondsAmount = currentSeconds % 60

    const minutes = String(minutesAmount).padStart(2, '0')
    const seconds = String(secondsAmount).padStart(2, '0')

    useEffect(() => {
        if (activeCycle) {
            document.title = `Ignte Timer - ${minutes}:${seconds}`
        }
    }, [minutes, seconds, activeCycle])

    useEffect(() => {
        let interval: number;
        if (activeCycle) {
            const interval = setInterval(() => {
                const secondsDifference = differenceInMilliseconds(
                    new Date(),
                    activeCycle.startDate,
                )

                if (secondsDifference > totalSeconds) {
                    MarkCurrentCycleAsFinished()
                    setSecondsPassed(totalSeconds)
                    clearInterval(interval)
                }
                else {
                    setSecondsPassed(secondsDifference)
                }
            }, 1000)


            return () => {
                clearInterval(interval)
            }
        }
    }, [activeCycle, totalSeconds, activeCycleId, MarkCurrentCycleAsFinished, setSecondsPassed])

    return (
        <CountDownContainer>
            <span>{minutes[0]}</span>
            <span>{minutes[1]}</span>
            <Separator>:</Separator>
            <span>{seconds[0]}</span>
            <span>{seconds[1]}</span>
        </CountDownContainer>
    );
}