"use strict";


function bayes_create(labels, log_2_vector_length) {
  const vector_length = 1 << log_2_vector_length;
  const model = new Uint32Array(2 + 1 + labels * (1 + vector_length));
  model[0] = labels;
  model[1] = vector_length;
  return model;
}

function bayes_train(model, label, vector) {
  const vector_length = model[1];
  const label_offset = 3 + label * (1 + vector_length);
  model[2]++;
  model[label_offset + 0]++;
  for(let i = 0; i < vector_length; i++) {
    model[label_offset + i + 1] += vector[i];
  }
}

function bayes_classify(model, vector) {
  const labels = model[0];
  const vector_length = model[1];
  const log_model_count = Math.log(model[2] + 1);
  let best_score = -Infinity;
  let best_label = -1;

  for(let label = 0; label < labels; label++) {
    const label_offset = 3 + label * (1 + vector_length);
    const log_label_count = Math.log(model[label_offset] + 1);

    let score = log_label_count - log_model_count;
    for(let i = 0; i < vector_length; i++) {
      const feature = vector[i];

      if(feature > 0) {
        const log_feature_count = Math.log(model[label_offset + i + 1] + 1);
        score += (log_feature_count - log_label_count) * feature;
      }
    }

    if(score > best_score) {
      best_score = score;
      best_label = label;
    }
  }

  return best_label;
}


function hash(string) {
  let hash = 5381;

  const n = string.length;
  for(let i = 0; i < n; i++) {
    hash = Math.imul(hash, 33) ^ string.charCodeAt(i);
  }

  return hash >>> 0;
}

function words(string, log_2_vector_length) {
  const vector_length = 1 << log_2_vector_length;
  const vector = new Uint32Array(vector_length);

  const words = string.match(/\w+(?:['\-]\w+)*/g);
  if(words) {
    const mask = vector_length - 1;
    for(const word of words) {
      vector[hash(word.toLowerCase()) & mask]++;
    }
  }

  return vector;
}


const log_2_vector_length = 8;
const model = bayes_create(4, log_2_vector_length);
bayes_train(model, 0, words("Then Jehovah answered Job out of the whirlwind, and said, Who is this that darkeneth counsel By words without knowledge? Gird up now thy loins like a man; For I will demand of thee, and declare thou unto me. Where wast thou when I laid the foundations of the earth? Declare, if thou hast understanding. Who determined the measures thereof, if thou knowest? Or who stretched the line upon it? Whereupon were the foundations thereof fastened? Or who laid the corner-stone thereof, When the morning stars sang together, And all the sons of God shouted for joy? Or [who] shut up the sea with doors, When it brake forth, [as if] it had issued out of the womb; When I made clouds the garment thereof, And thick darkness a swaddling-band for it, And marked out for it my bound, And set bars and doors, And said, Hitherto shalt thou come, but no further; And here shall thy proud waves be stayed? Hast thou commanded the morning since thy days [began], [And] caused the dayspring to know its place; That it might take hold of the ends of the earth, And the wicked be shaken out of it? It is changed as clay under the seal; And [all things] stand forth as a garment: And from the wicked their light is withholden, And the high arm is broken. Hast thou entered into the springs of the sea? Or hast thou walked in the recesses of the deep? Have the gates of death been revealed unto thee? Or hast thou seen the gates of the shadow of death? Hast thou comprehended the earth in its breadth? Declare, if thou knowest it all. Where is the way to the dwelling of light? And as for darkness, where is the place thereof, That thou shouldest take it to the bound thereof, And that thou shouldest discern the paths to the house thereof? [Doubtless], thou knowest, for thou wast then born, And the number of thy days is great! Hast thou entered the treasuries of the snow, Or hast thou seen the treasures of the hail, Which I have reserved against the time of trouble, Against the day of battle and war? By what way is the light parted, Or the east wind scattered upon the earth? Who hath cleft a channel for the waterflood, Or the way for the lightning of the thunder; To cause it to rain on a land where no man is; On the wilderness, wherein there is no man; To satisfy the waste and desolate [ground], And to cause the tender grass to spring forth? Hath the rain a father? Or who hath begotten the drops of dew? Out of whose womb came the ice? And the hoary frost of heaven, who hath gendered it? The waters hide themselves [and become] like stone, And the face of the deep is frozen. Canst thou bind the cluster of the Pleiades, Or loose the bands of Orion? Canst thou lead forth the Mazzaroth in their season? Or canst thou guide the Bear with her train? Knowest thou the ordinances of the heavens? Canst thou establish the dominion thereof in the earth? Canst thou lift up thy voice to the clouds, That abundance of waters may cover thee? Canst thou send forth lightnings, that they may go, And say unto thee, Here we are? Who hath put wisdom in the inward parts? Or who hath given understanding to the mind? Who can number the clouds by wisdom? Or who can pour out the bottles of heaven, When the dust runneth into a mass, And the clods cleave fast together? Canst thou hunt the prey for the lioness, Or satisfy the appetite of the young lions, When they couch in their dens, [And] abide in the covert to lie in wait? Who provideth for the raven his prey, When his young ones cry unto God, [And] wander for lack of food?", log_2_vector_length));
bayes_train(model, 1, words("Y respondió Jehová á Job desde un torbellino, y dijo: ¿Quién es ése que oscurece el consejo Con palabras sin sabiduría? Ahora ciñe como varón tus lomos; Yo te preguntaré, y hazme saber tú. ¿Dónde estabas cuando yo fundaba la tierra? Házme lo saber, si tienes inteligencia. ¿Quién ordenó sus medidas, si lo sabes? ¿O quién extendió sobre ella cordel? ¿Sobre qué están fundadas sus basas? ¿O quién puso su piedra angular, Cuando las estrellas todas del alba alababan, Y se regocijaban todos los hijos de Dios? ¿Quién encerró con puertas la mar, Cuando se derramaba por fuera como saliendo de madre; Cuando puse yo nubes por vestidura suya, Y por su faja oscuridad. Y establecí sobre ella mi decreto, Y le puse puertas y cerrojo, Y dije: Hasta aquí vendrás, y no pasarás adelante, Y ahí parará la hinchazón de tus ondas? ¿Has tu mandado á la mañana en tus días? ¿Has mostrado al alba su lugar, Para que ocupe los fines de la tierra, Y que sean sacudidos de ella los impíos? Trasmúdase como lodo bajo de sello, Y viene á estar como con vestidura: Mas la luz de los impíos es quitada de ellos, Y el brazo enaltecido es quebrantado. ¿Has entrado tú hasta los profundos de la mar, Y has andado escudriñando el abismo? ¿Hante sido descubiertas las puertas de la muerte, Y has visto las puertas de la sombra de muerte? ¿Has tú considerado hasta las anchuras de la tierra? Declara si sabes todo esto. ¿Por dónde va el camino á la habitación de la luz, Y dónde está el lugar de las tinieblas? ¿Si llevarás tú ambas cosas á sus términos, Y entenderás las sendas de su casa? ¿Sabíaslo tú porque hubieses ya nacido, O porque es grande el número de tus días? ¿Has tú entrado en los tesoros de la nieve, O has visto los tesoros del granizo, Lo cual tengo yo reservado para el tiempo de angustia, Para el día de la guerra y de la batalla? ¿Por qué camino se reparte la luz, Y se esparce el viento solano sobre la tierra? ¿Quién repartió conducto al turbión, Y camino á los relámpagos y truenos, Haciendo llover sobre la tierra deshabitada, Sobre el desierto, donde no hay hombre, Para hartar la tierra desierta é inculta, Y para hacer brotar la tierna hierba? ¿Tiene la lluvia padre? ¿O quién engendró las gotas del rocío? ¿De qué vientre salió el hielo? Y la escarcha del cielo, ¿quién la engendró? Las aguas se endurecen á manera de piedra, Y congélase la haz del abismo. ¿Podrás tú impedir las delicias de las Pléyades, O desatarás las ligaduras del Orión? ¿Sacarás tú á su tiempo los signos de los cielos, O guiarás el Arcturo con sus hijos? ¿Supiste tú las ordenanzas de los cielos? ¿Dispondrás tú de su potestad en la tierra? ¿Alzarás tú á las nubes tu voz, Para que te cubra muchedumbre de aguas? ¿Enviarás tú los relámpagos, para que ellos vayan? ¿Y diránte ellos: Henos aquí? ¿Quién puso la sabiduría en el interior? ¿O quién dió al entendimiento la inteligencia? ¿Quién puso por cuenta los cielos con sabiduría? Y los odres de los cielos, ¿quién los hace parar, Cuando el polvo se ha convertido en dureza, Y los terrones se han pegado unos con otros? ¿Cazarás tú la presa para el león? ¿Y saciarás el hambre de los leoncillos, Cuando están echados en las cuevas, O se están en sus guaridas para acechar? ¿Quién preparó al cuervo su alimento, Cuando sus pollos claman á Dios, Bullendo de un lado á otro por carecer de comida?", log_2_vector_length));
bayes_train(model, 2, words("Und der HERR antwortete Hiob aus dem Wetter und sprach: Wer ist der, der den Ratschluß verdunkelt mit Worten ohne Verstand? Gürte deine Lenden wie ein Mann; ich will dich fragen, lehre mich! Wo warst du, da ich die Erde gründete? Sage an, bist du so klug! Weißt du, wer ihr das Maß gesetzt hat oder wer über sie eine Richtschnur gezogen hat? Worauf stehen ihre Füße versenkt, oder wer hat ihren Eckstein gelegt, da mich die Morgensterne miteinander lobten und jauchzten alle Kinder Gottes? Wer hat das Meer mit Türen verschlossen, da es herausbrach wie aus Mutterleib, da ich's mit Wolken kleidete und in Dunkel einwickelte wie in Windeln, da ich ihm den Lauf brach mit meinem Damm und setzte ihm Riegel und Türen und sprach: \"Bis hierher sollst du kommen und nicht weiter; hier sollen sich legen deine stolzen Wellen!\"? Hast du bei deiner Zeit dem Morgen geboten und der Morgenröte ihren Ort gezeigt, daß sie die Ecken der Erde fasse und die Gottlosen herausgeschüttelt werden? Sie wandelt sich wie Ton unter dem Siegel, und alles steht da wie im Kleide. Und den Gottlosen wird ihr Licht genommen, und der Arm der Hoffärtigen wird zerbrochen. Bist du in den Grund des Meeres gekommen und in den Fußtapfen der Tiefe gewandelt? Haben sich dir des Todes Tore je aufgetan, oder hast du gesehen die Tore der Finsternis? Hast du vernommen wie breit die Erde sei? Sage an, weißt du solches alles! Welches ist der Weg, da das Licht wohnt, und welches ist der Finsternis Stätte, daß du mögest ergründen seine Grenze und merken den Pfad zu seinem Hause? Du weißt es ja; denn zu der Zeit wurdest du geboren, und deiner Tage sind viel. Bist du gewesen, da der Schnee her kommt, oder hast du gesehen, wo der Hagel her kommt, die ich habe aufbehalten bis auf die Zeit der Trübsal und auf den Tag des Streites und Krieges? Durch welchen Weg teilt sich das Licht und fährt der Ostwind hin über die Erde? Wer hat dem Platzregen seinen Lauf ausgeteilt und den Weg dem Blitz und dem Donner und läßt regnen aufs Land da niemand ist, in der Wüste, da kein Mensch ist, daß er füllt die Einöde und Wildnis und macht das Gras wächst? Wer ist des Regens Vater? Wer hat die Tropfen des Taues gezeugt? Aus wes Leib ist das Eis gegangen, und wer hat den Reif unter dem Himmel gezeugt, daß das Wasser verborgen wird wie unter Steinen und die Tiefe oben gefriert? Kannst du die Bande der sieben Sterne zusammenbinden oder das Band des Orion auflösen? Kannst du den Morgenstern hervorbringen zu seiner Zeit oder den Bären am Himmel samt seinen Jungen heraufführen? Weißt du des Himmels Ordnungen, oder bestimmst du seine Herrschaft über die Erde? Kannst du deine Stimme zu der Wolke erheben, daß dich die Menge des Wassers bedecke? Kannst du die Blitze auslassen, daß sie hinfahren und sprechen zu dir: Hier sind wir? Wer gibt die Weisheit in das Verborgene? Wer gibt verständige Gedanken? Wer ist so weise, der die Wolken zählen könnte? Wer kann die Wasserschläuche am Himmel ausschütten, wenn der Staub begossen wird, daß er zuhauf läuft und die Schollen aneinander kleben? Kannst du der Löwin ihren Raub zu jagen geben und die jungen Löwen sättigen, wenn sie sich legen in ihre Stätten und ruhen in der Höhle, da sie lauern? Wer bereitet den Raben die Speise, wenn seine Jungen zu Gott rufen und fliegen irre, weil sie nicht zu essen haben?", log_2_vector_length));
bayes_train(model, 3, words("L'Éternel répondit à Job du milieu de la tempête et dit: Qui est celui qui obscurcit mes desseins par des discours sans intelligence? Ceins tes reins comme un vaillant homme; je t'interrogerai, et tu m'instruiras. Où étais-tu quand je fondais la terre? Dis-le, si tu as de l'intelligence. Qui en a fixé les dimensions, le sais-tu? Ou qui a étendu sur elle le cordeau? Sur quoi ses bases sont-elles appuyées? Ou qui en a posé la pierre angulaire, alors que les étoiles du matin éclataient en chants d'allégresse, et que tous les fils de Dieu poussaient des cris de joie? Qui a fermé la mer avec des portes, quand elle s'élança du sein maternel; quand je fis de la nuée son vêtement, et de l'obscurité ses langes; quand je lui imposai ma loi, et que je lui mis des barrières et des portes; quand je dis: Tu viendras jusqu'ici, tu n'iras pas au delà; ici s'arrêtera l'orgueil de tes flots? Depuis que tu existes, as-tu commandé au matin? As-tu montré sa place à l'aurore, pour qu'elle saisisse les extrémités de la terre, et que les méchants en soient secoués; pour que la terre se transforme comme l'argile qui reçoit une empreinte, et qu'elle soit parée comme d'un vêtement; pour que les méchants soient privés de leur lumière, et que le bras qui se lève soit brisé? As-tu pénétré jusqu'aux sources de la mer? T'es-tu promené dans les profondeurs de l'abîme? Les portes de la mort t'ont-elles été ouvertes? As-tu vu les portes de l'ombre de la mort? As-tu embrassé du regard l'étendue de la terre? Parle, si tu sais toutes ces choses. Où est le chemin qui conduit au séjour de la lumière? Et les ténèbres, où ont-elles leur demeure? Peux-tu les saisir à leur limite, et connaître les sentiers de leur habitation? Tu le sais, car alors tu étais né, et le nombre de tes jours est grand! És-tu parvenu jusqu'aux amas de neige? As-tu vu les dépôts de grêle, que je tiens en réserve pour les temps de détresse, pour les jours de guerre et de bataille? Par quel chemin la lumière se divise-t-elle, et le vent d'orient se répand-il sur la terre? Qui a ouvert un passage à la pluie, et tracé la route de l'éclair et du tonnerre, pour que la pluie tombe sur une terre sans habitants, sur un désert où il n'y a point d'hommes; pour qu'elle abreuve les lieux solitaires et arides, et qu'elle fasse germer et sortir l'herbe? La pluie a-t-elle un père? Qui fait naître les gouttes de la rosée? Du sein de qui sort la glace, et qui enfante le frimas du ciel, pour que les eaux se cachent comme une pierre, et que la surface de l'abîme soit enchaînée? Noues-tu les liens des Pléiades, ou détaches-tu les cordages de l'Orion? Fais-tu paraître en leur temps les signes du zodiaque, et conduis-tu la Grande Ourse avec ses petits? Connais-tu les lois du ciel? Règles-tu son pouvoir sur la terre? Élèves-tu la voix jusqu'aux nuées, pour appeler à toi des torrents d'eaux? Lances-tu les éclairs? Partent-ils? Te disent-ils: Nous voici? Qui a mis la sagesse dans le cœur, ou qui a donné l'intelligence à l'esprit? Qui peut avec sagesse compter les nuages, et verser les outres des cieux, pour que la poussière se mette à ruisseler, et que les mottes de terre se collent ensemble? Chasses-tu la proie pour la lionne, et apaises-tu la faim des lionceaux, quand ils sont couchés dans leur tanière, quand ils sont en embuscade dans leur repaire? Qui prépare au corbeau sa pâture, quand ses petits crient vers Dieu, quand ils sont errants et affamés?", log_2_vector_length));

console.log(bayes_classify(model, words("This is a sentence in English.", log_2_vector_length)));
console.log(bayes_classify(model, words("Esta es una frase en español.", log_2_vector_length)));
console.log(bayes_classify(model, words("Das ist ein Satz in deutscher Sprache.", log_2_vector_length)));
console.log(bayes_classify(model, words("Il s'agit d'une phrase en français.", log_2_vector_length)));
