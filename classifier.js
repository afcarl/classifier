var Classifier;

(function() {
  "use strict";

  function Label() {
    this.features = {};
    this.total = 0;
  }

  Label.prototype = {
    add: function(feature) {
      if(!this.features.hasOwnProperty(feature))
        this.features[feature] = 0;

      ++this.features[feature];
      ++this.total;
    },
    get: function(feature) {
      return this.features.hasOwnProperty(feature) ? this.features[feature] : 0;
    }
  };

  Classifier = function(power, smoothing) {
    this.labels = {};
    this.total = 0;
    this.powerConstant = (power !== undefined ? power : 1.0);
    this.smoothingConstant = (smoothing !== undefined ? smoothing : 1);
  };

  Classifier.prototype = {
    train: function(label, features) {
      var i;

      if(!this.labels.hasOwnProperty(label))
        this.labels[label] = new Label();

      for(i = features.length; i--; ) {
        this.labels[label].add(features[i]);
        ++this.total;
      }
    },
    classify: function(features) {
      var bestLabel = null,
          bestScore = Number.NEGATIVE_INFINITY,
          label, score, i;

      for(label in this.labels)
        if(this.labels.hasOwnProperty(label)) {
          score = this.powerConstant * Math.log((this.labels[label].total + this.smoothingConstant) / (this.total + this.smoothingConstant));

          for(i = features.length; i--; )
            score += Math.log((this.labels[label].get(features[i]) + this.smoothingConstant) / (this.labels[label].total + this.smoothingConstant));

          if(score > bestScore) {
            bestScore = score;
            bestLabel = label;
          }
        }

      return bestLabel;
    }
  };
})();

function words(str) {
  var i;

  if(!(str = str.match(/\w+(?:['\-]\w+)*/g)))
    return [];

  for(i = str.length; i--; )
    str[i] = str[i].toLowerCase();

  return str;
}

var model = new Classifier();

model.train("en", words("Then Jehovah answered Job out of the whirlwind, and said, Who is this that darkeneth counsel By words without knowledge? Gird up now thy loins like a man; For I will demand of thee, and declare thou unto me. Where wast thou when I laid the foundations of the earth? Declare, if thou hast understanding. Who determined the measures thereof, if thou knowest? Or who stretched the line upon it? Whereupon were the foundations thereof fastened? Or who laid the corner-stone thereof, When the morning stars sang together, And all the sons of God shouted for joy? Or [who] shut up the sea with doors, When it brake forth, [as if] it had issued out of the womb; When I made clouds the garment thereof, And thick darkness a swaddling-band for it, And marked out for it my bound, And set bars and doors, And said, Hitherto shalt thou come, but no further; And here shall thy proud waves be stayed? Hast thou commanded the morning since thy days [began], [And] caused the dayspring to know its place; That it might take hold of the ends of the earth, And the wicked be shaken out of it? It is changed as clay under the seal; And [all things] stand forth as a garment: And from the wicked their light is withholden, And the high arm is broken. Hast thou entered into the springs of the sea? Or hast thou walked in the recesses of the deep? Have the gates of death been revealed unto thee? Or hast thou seen the gates of the shadow of death? Hast thou comprehended the earth in its breadth? Declare, if thou knowest it all. Where is the way to the dwelling of light? And as for darkness, where is the place thereof, That thou shouldest take it to the bound thereof, And that thou shouldest discern the paths to the house thereof? [Doubtless], thou knowest, for thou wast then born, And the number of thy days is great! Hast thou entered the treasuries of the snow, Or hast thou seen the treasures of the hail, Which I have reserved against the time of trouble, Against the day of battle and war? By what way is the light parted, Or the east wind scattered upon the earth? Who hath cleft a channel for the waterflood, Or the way for the lightning of the thunder; To cause it to rain on a land where no man is; On the wilderness, wherein there is no man; To satisfy the waste and desolate [ground], And to cause the tender grass to spring forth? Hath the rain a father? Or who hath begotten the drops of dew? Out of whose womb came the ice? And the hoary frost of heaven, who hath gendered it? The waters hide themselves [and become] like stone, And the face of the deep is frozen. Canst thou bind the cluster of the Pleiades, Or loose the bands of Orion? Canst thou lead forth the Mazzaroth in their season? Or canst thou guide the Bear with her train? Knowest thou the ordinances of the heavens? Canst thou establish the dominion thereof in the earth? Canst thou lift up thy voice to the clouds, That abundance of waters may cover thee? Canst thou send forth lightnings, that they may go, And say unto thee, Here we are? Who hath put wisdom in the inward parts? Or who hath given understanding to the mind? Who can number the clouds by wisdom? Or who can pour out the bottles of heaven, When the dust runneth into a mass, And the clods cleave fast together? Canst thou hunt the prey for the lioness, Or satisfy the appetite of the young lions, When they couch in their dens, [And] abide in the covert to lie in wait? Who provideth for the raven his prey, When his young ones cry unto God, [And] wander for lack of food?"));
model.train("es", words("Y respondió Jehová á Job desde un torbellino, y dijo: ¿Quién es ése que oscurece el consejo Con palabras sin sabiduría? Ahora ciñe como varón tus lomos; Yo te preguntaré, y hazme saber tú. ¿Dónde estabas cuando yo fundaba la tierra? Házme lo saber, si tienes inteligencia. ¿Quién ordenó sus medidas, si lo sabes? ¿O quién extendió sobre ella cordel? ¿Sobre qué están fundadas sus basas? ¿O quién puso su piedra angular, Cuando las estrellas todas del alba alababan, Y se regocijaban todos los hijos de Dios? ¿Quién encerró con puertas la mar, Cuando se derramaba por fuera como saliendo de madre; Cuando puse yo nubes por vestidura suya, Y por su faja oscuridad. Y establecí sobre ella mi decreto, Y le puse puertas y cerrojo, Y dije: Hasta aquí vendrás, y no pasarás adelante, Y ahí parará la hinchazón de tus ondas? ¿Has tu mandado á la mañana en tus días? ¿Has mostrado al alba su lugar, Para que ocupe los fines de la tierra, Y que sean sacudidos de ella los impíos? Trasmúdase como lodo bajo de sello, Y viene á estar como con vestidura: Mas la luz de los impíos es quitada de ellos, Y el brazo enaltecido es quebrantado. ¿Has entrado tú hasta los profundos de la mar, Y has andado escudriñando el abismo? ¿Hante sido descubiertas las puertas de la muerte, Y has visto las puertas de la sombra de muerte? ¿Has tú considerado hasta las anchuras de la tierra? Declara si sabes todo esto. ¿Por dónde va el camino á la habitación de la luz, Y dónde está el lugar de las tinieblas? ¿Si llevarás tú ambas cosas á sus términos, Y entenderás las sendas de su casa? ¿Sabíaslo tú porque hubieses ya nacido, O porque es grande el número de tus días? ¿Has tú entrado en los tesoros de la nieve, O has visto los tesoros del granizo, Lo cual tengo yo reservado para el tiempo de angustia, Para el día de la guerra y de la batalla? ¿Por qué camino se reparte la luz, Y se esparce el viento solano sobre la tierra? ¿Quién repartió conducto al turbión, Y camino á los relámpagos y truenos, Haciendo llover sobre la tierra deshabitada, Sobre el desierto, donde no hay hombre, Para hartar la tierra desierta é inculta, Y para hacer brotar la tierna hierba? ¿Tiene la lluvia padre? ¿O quién engendró las gotas del rocío? ¿De qué vientre salió el hielo? Y la escarcha del cielo, ¿quién la engendró? Las aguas se endurecen á manera de piedra, Y congélase la haz del abismo. ¿Podrás tú impedir las delicias de las Pléyades, O desatarás las ligaduras del Orión? ¿Sacarás tú á su tiempo los signos de los cielos, O guiarás el Arcturo con sus hijos? ¿Supiste tú las ordenanzas de los cielos? ¿Dispondrás tú de su potestad en la tierra? ¿Alzarás tú á las nubes tu voz, Para que te cubra muchedumbre de aguas? ¿Enviarás tú los relámpagos, para que ellos vayan? ¿Y diránte ellos: Henos aquí? ¿Quién puso la sabiduría en el interior? ¿O quién dió al entendimiento la inteligencia? ¿Quién puso por cuenta los cielos con sabiduría? Y los odres de los cielos, ¿quién los hace parar, Cuando el polvo se ha convertido en dureza, Y los terrones se han pegado unos con otros? ¿Cazarás tú la presa para el león? ¿Y saciarás el hambre de los leoncillos, Cuando están echados en las cuevas, O se están en sus guaridas para acechar? ¿Quién preparó al cuervo su alimento, Cuando sus pollos claman á Dios, Bullendo de un lado á otro por carecer de comida?"));
model.train("de", words("Und der HERR antwortete Hiob aus dem Wetter und sprach: Wer ist der, der den Ratschluß verdunkelt mit Worten ohne Verstand? Gürte deine Lenden wie ein Mann; ich will dich fragen, lehre mich! Wo warst du, da ich die Erde gründete? Sage an, bist du so klug! Weißt du, wer ihr das Maß gesetzt hat oder wer über sie eine Richtschnur gezogen hat? Worauf stehen ihre Füße versenkt, oder wer hat ihren Eckstein gelegt, da mich die Morgensterne miteinander lobten und jauchzten alle Kinder Gottes? Wer hat das Meer mit Türen verschlossen, da es herausbrach wie aus Mutterleib, da ich's mit Wolken kleidete und in Dunkel einwickelte wie in Windeln, da ich ihm den Lauf brach mit meinem Damm und setzte ihm Riegel und Türen und sprach: \"Bis hierher sollst du kommen und nicht weiter; hier sollen sich legen deine stolzen Wellen!\"? Hast du bei deiner Zeit dem Morgen geboten und der Morgenröte ihren Ort gezeigt, daß sie die Ecken der Erde fasse und die Gottlosen herausgeschüttelt werden? Sie wandelt sich wie Ton unter dem Siegel, und alles steht da wie im Kleide. Und den Gottlosen wird ihr Licht genommen, und der Arm der Hoffärtigen wird zerbrochen. Bist du in den Grund des Meeres gekommen und in den Fußtapfen der Tiefe gewandelt? Haben sich dir des Todes Tore je aufgetan, oder hast du gesehen die Tore der Finsternis? Hast du vernommen wie breit die Erde sei? Sage an, weißt du solches alles! Welches ist der Weg, da das Licht wohnt, und welches ist der Finsternis Stätte, daß du mögest ergründen seine Grenze und merken den Pfad zu seinem Hause? Du weißt es ja; denn zu der Zeit wurdest du geboren, und deiner Tage sind viel. Bist du gewesen, da der Schnee her kommt, oder hast du gesehen, wo der Hagel her kommt, die ich habe aufbehalten bis auf die Zeit der Trübsal und auf den Tag des Streites und Krieges? Durch welchen Weg teilt sich das Licht und fährt der Ostwind hin über die Erde? Wer hat dem Platzregen seinen Lauf ausgeteilt und den Weg dem Blitz und dem Donner und läßt regnen aufs Land da niemand ist, in der Wüste, da kein Mensch ist, daß er füllt die Einöde und Wildnis und macht das Gras wächst? Wer ist des Regens Vater? Wer hat die Tropfen des Taues gezeugt? Aus wes Leib ist das Eis gegangen, und wer hat den Reif unter dem Himmel gezeugt, daß das Wasser verborgen wird wie unter Steinen und die Tiefe oben gefriert? Kannst du die Bande der sieben Sterne zusammenbinden oder das Band des Orion auflösen? Kannst du den Morgenstern hervorbringen zu seiner Zeit oder den Bären am Himmel samt seinen Jungen heraufführen? Weißt du des Himmels Ordnungen, oder bestimmst du seine Herrschaft über die Erde? Kannst du deine Stimme zu der Wolke erheben, daß dich die Menge des Wassers bedecke? Kannst du die Blitze auslassen, daß sie hinfahren und sprechen zu dir: Hier sind wir? Wer gibt die Weisheit in das Verborgene? Wer gibt verständige Gedanken? Wer ist so weise, der die Wolken zählen könnte? Wer kann die Wasserschläuche am Himmel ausschütten, wenn der Staub begossen wird, daß er zuhauf läuft und die Schollen aneinander kleben? Kannst du der Löwin ihren Raub zu jagen geben und die jungen Löwen sättigen, wenn sie sich legen in ihre Stätten und ruhen in der Höhle, da sie lauern? Wer bereitet den Raben die Speise, wenn seine Jungen zu Gott rufen und fliegen irre, weil sie nicht zu essen haben?"));

console.log(model.classify(words("This is a sentence in English.")));
console.log(model.classify(words("Esta es una frase en español.")));
console.log(model.classify(words("Das ist ein Satz in deutscher Sprache.")));
