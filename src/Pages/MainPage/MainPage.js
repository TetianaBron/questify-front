import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import SectionMainPage from '../../Components/TodaySection/SectionMainPage'
import CardList from '../../Components/CardList/CardList'
import Header from '../../Components/Header/Header'
import Icon from '../../Components/Icon'
import TodaySection from '../../Components/TodaySection/TodaySection'

import cardsOperations from '../../Redux/cards/cardsOperations'
import cardsSelectors from '../../Redux/cards/cardsSelectors'

import s from './MainPage.module.css'

export default function Main() {
  const [doneIsShown, setDoneIsShown] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(cardsOperations.fetchActiveCards())
  }, [dispatch])

  const activeTodayCards = useSelector(cardsSelectors.getActiveTodayCards)
  const activeTomorrowCards = useSelector(cardsSelectors.getActiveTomorrowCards)
  const doneCards = useSelector(cardsSelectors.getDoneCards)
  const challengeCards = useSelector(cardsSelectors.getChallengeCards)
  const activeThisWeekCards = useSelector(cardsSelectors.getActiveThisWeekCards)
  const activeThisMonthCards = useSelector(
    cardsSelectors.getActiveThisMonthCards,
  )
  const activeNextMonthsCards = useSelector(
    cardsSelectors.getActiveNextMonthsCards,
  )
  const todayCards = [...getSorted(activeTodayCards), ...getSorted(challengeCards)]

  function onShowDone() {
    setDoneIsShown(!doneIsShown)

    if (!(doneCards.length >= 1)) {
      dispatch(cardsOperations.fetchDoneCards())
    }
  }

  function getSorted(list) {
    return list.sort((a, b) => {
      const dateA = new Date(a.deadline)
      const dateB = new Date(b.deadline)
        if (dateA < dateB) {
            return -1;
        }
        if (dateA > dateB) {
            return 1;
        }

        return 0;
    });
  }

  return (
    <>
      <Header />
      <div className={s.container}>
        <TodaySection cards={todayCards} />

        <SectionMainPage title="TOMORROW" cardList={getSorted(activeTomorrowCards)} />
        <SectionMainPage title="THIS WEEK" cardList={getSorted(activeThisWeekCards)} />
        <SectionMainPage title="THIS MONTH" cardList={getSorted(activeThisMonthCards)} />
        <SectionMainPage title="NEXT MONTH" cardList={getSorted(activeNextMonthsCards)} />
        
        <section className={s.sectionDone}>
          <div className={s.lineWrapper}>
            <button className={s.btnDone} onClick={onShowDone}>
              DONE
              <Icon
                className={s.IconDone}
                name={doneIsShown ? 'triangle-up' : 'triangle-down'}
                size={12}
              />
            </button>
          </div>

          {doneIsShown && <CardList cards={doneCards} />}
        </section>
      </div>
    </>
  )
}
