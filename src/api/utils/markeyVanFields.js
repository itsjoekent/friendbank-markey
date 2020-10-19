const BSD_VAN_MAP = {
  support: {
    'Definitely': '1433903',
    'Probably': '1433904',
    'Undecided': '1433905',
    'Probably not': '1465097',
    'Definitely not': '1465098',
    'Too Young/Ineligible to Vote': '1598130',

    'Definitivamente': '1433903',
    'Probablemente': '1433904',
    'Indeciso': '1433905',
    'Probablemente no': '1465097',
    'Definitivamente no': '1465098',
    'Demasiado joven/Inelegible para votar': '1598130',
  },
  volunteer: {
    'Yes': '1411494',
    'Maybe': '1411495',
    'Later': '1411496',
    'No': '1411497',

    'Sí': '1411494',
    'Tal vez': '1411495',
    'Más tarde': '1411496',
    'No': '1411497',
  },
  vote: {
    // Legacy primary election language support (in-between deployment/migration)
    'I’ve already voted': '1606529',
    'I’ve received my mail-in ballot and still need to return it': '1606507',
    'I’m planning to vote early between August 22-28': '1606515',
    'I’m planning to vote on Election Day, September 1': '1606526',

    'I’ve already voted':'1606529',
    'Ya vote': '1606529',

    'I’ve received my mail-in ballot and still need to return it': '1606507',
    'He recibido mi boleta por correo y todavía tengo que devolverla': '1606507',

    'I’m planning to vote early between October 17-30': '1606515',
    'Votaré anticipadamente entre el 17 y el 30 de octubre': '1606515',

    'I’m planning to vote on Election Day, November 3': '1606526',
    'Votaré el día de las elecciones, el 3 de noviembre': '1606526',
  },
};

module.exports = BSD_VAN_MAP;

// Vote by Mail|1606507
// Undecided|1661784
// Absentee Ballot|1654319
// Vote Early @ Polls|1606515
// Election Day @ Polls|1606526
// Already Voted|1606529
// Not Interested|1606541
// Temporary|1670006
