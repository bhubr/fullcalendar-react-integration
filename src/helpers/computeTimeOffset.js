export function getOffsetString() {
  // Calcul du décalage entre la date courante et le temps universel
  // GMT ou Greenwich Mean Time
  // On crée un objet Date
  const d = new Date()
  // On récupère son décalage en minutes par rapport à GMT
  const offset = d.getTimezoneOffset()
  // padStart permet de combler par un caractère supplémentaire
  // ici '0' jusqu'à atteindre une certaine longueur de chaîne, ici 2
  const offsetHours = (-offset / 60).toString().padStart(2, '0')
  // On doit calculer quelque chose comme +02:00 ou +01:00
  // (en France suivant heure d'été ou d'hiver)
  const sign = offsetHours > 0 ? '+' : '-'

  return `${sign}${offsetHours}:00`
}

export function getOffsetHours() {
  // Calcul du décalage entre la date courante et le temps universel
  // GMT ou Greenwich Mean Time
  // On crée un objet Date
  const d = new Date()
  // On récupère son décalage en minutes par rapport à GMT
  const offset = d.getTimezoneOffset()
  // padStart permet de combler par un caractère supplémentaire
  // ici '0' jusqu'à atteindre une certaine longueur de chaîne, ici 2
  return (-offset / 60)
}
