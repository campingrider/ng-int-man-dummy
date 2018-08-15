window.addEventListener('load',function(){
  let message = "Sehr geehrter Kunde,\n\nFolgende Bestellung wurde registriert:\n\n";
  let orderedSomething = false;

  if (location.search) {
    let params = { names : {}, extras: {}, quantity: {}}

    let arr = decodeURI(location.search.replace(/\+/g,'%20')).substr(1).split('&');

    let reg = /^(.+)\[(\d+)\]=(.+)$/;

    for (let i = 0; i < arr.length; i++) {
      let res = null;
      if (res = reg.exec(arr[i])) {
        if (!params[res[1]][res[2]]) {
          params[res[1]][res[2]] = res[3];
        } else {
          params[res[1]][res[2]] += ", "+res[3];
        }
      } else {
        console.log('Entry "'+arr[i]+'" does not match RegEx "'+reg.source+'"!');
      }
    }

    for (let i in params['quantity']) {
      if (params['quantity'][i] != '0') {
        if (params['names'][i]) {
          orderedSomething = true;
          let spaces=""; for (let j = params['names'][i].length; j < 30; j++) { spaces += " "; }
          message += "\t"+params['quantity'][i]+"x \t "+params['names'][i]+spaces;
          if (params['extras'][i]) {
            message += "(Extras: "+params['extras'][i]+")\n";
          } else {
            message += "(Keine Extras)\n";
          }
        }
      }
    }

    if (orderedSomething) {
      window.alert(message+"\n\nVielen Dank für Ihre Bestellung, wir geben diese direkt an unseren Baum weiter. In etwa 150 Jahren ist ihre Bestellung abholbereit.\n\n Ihr Team von Casa del Diavolo.");
    }
  }
});
