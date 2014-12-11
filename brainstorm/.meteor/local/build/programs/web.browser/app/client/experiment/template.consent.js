(function(){
Template.__define__("ConsentPage", (function() {
  var view = this;
  return [ HTML.DIV({
    "class": "container"
  }, "\n    ", HTML.DIV({
    "class": "row"
  }, "\n      ", Spacebars.include(view.lookupTemplate("MTurkConsentPage")), "\n    "), " ", HTML.Raw("<!-- End row -->"), "\n    ", HTML.DIV({
    "class": "row"
  }, "\n      ", Spacebars.include(view.lookupTemplate("CPFooter")), "\n    "), " ", HTML.Raw("<!-- End row -->"), "\n  "), HTML.Raw(" <!-- End containter -->") ];
}));

Template.__define__("PageSection", (function() {
  var view = this;
  return [ HTML.DIV({
    "class": "row"
  }, "\n    ", HTML.H2(Blaze.View(function() {
    return Spacebars.mustache(view.lookup("heading"));
  })), "\n    ", HTML.DIV({
    "class": "sectionBody"
  }, "\n      ", Blaze.View(function() {
    return Spacebars.makeRaw(Spacebars.mustache(view.lookup("body")));
  }), "\n    "), HTML.Raw("<!-- end body -->"), "\n  "), HTML.Raw("<!-- end Row -->") ];
}));

Template.__define__("TextPage", (function() {
  var view = this;
  return HTML.DIV({
    "class": "container"
  }, "\n    ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("sections"));
  }, function() {
    return [ "\n      ", Spacebars.include(view.lookupTemplate("PageSection")), "\n    " ];
  }), "  \n  ");
}));

Template.__define__("MTurkConsentPage", (function() {
  var view = this;
  return HTML.Raw('<div class="container-fluid">\n<div class="row-fluid">\n<div class="span10 offset1">\n<h2>Participant Consent</h2>\n\n<p>This brainstorming study is part of a research study conducted by\nSteven Dang, Joel Chan, and Steven Dow at Carnegie Mellon University.</p>\n\n<p>The purpose of this study is to explore the characteristics of brainstorming using digital tools.</p>\n\n<h2>Procedures</h2>\n\n<p>During this study, you will be asked to brainstorm ideas on a given topic. If at any time you become frustrated or no longer want to participate, you may\nexit the session, and your compensation will be pro-rated according to your progress \nin the study.</p>\n\n<p>We plan to keep your identity private, and separate from the information we\ncollect. Your MTurk ID will be replaced by a code name in all publications and\npresentations that are released to the public.</p>\n\n<h2>Expected Duration and Location</h2>\n\n<p>Your participation will involve an approximately 20 minute session.</p>\n\n<h2>Participant Requirements</h2>\n\n<p>Participants must be over 18 years old, and living in the United States.</p>\n\n<h2>Risks</h2>\n\n<p>The risks and discomfort associated with participation in this study are no\ngreater than those ordinarily encountered in daily life or during the\nperformance of routine physical or psychological examinations or tests.</p>\n\n<h2>Rights</h2>\n\n<p>Your decision to participate in this study is voluntary.  You are free to\nstop participation at any point.  Refusal to participate, withdrawal of your\nconsent or discontinued participation in the study will not result in any\npenalty or loss of benefits or rights to which you might otherwise be entitled.\nThe Principal Investigator may at his/her discretion remove you from the study\nfor any of a number of reasons.  In such an event, you will not suffer any\npenalty or loss of benefits or rights to which you might otherwise be\nentitled.</p>\n\n<h2>Benefits</h2>\n<p>You may receive benefits from participation in the study, such as learning\ninteresting brainstorming strategies. Additionally, the knowledge gained in this study\nmay help improve methods of design practice.</p>\n\n<h2>Compensation &amp; Costs</h2>\n<p>You will be compensated $2.50 for completing this study via Mechanical turk. There are no additional cost to you for participating in this study.</p>\n\n<h2>Confidentiality</h2>\n<p>By participating in the study, you understand and agree that Carnegie Mellon\nmay be required to disclose this consent form, data and other personally\nidentifiable information as required by law, regulation, subpoena or court\norder.  Otherwise, your confidentiality will be maintained in the following\nmanner:</p>\n\n<p>To ensure that participants information is kept confidential, the\nresearchers will assign each participant a unique code and will refer to any\ndata collected during the study by that code. By participating, you understand\nand agree that the data and information gathered during this study may be used\nby Carnegie Mellon and published and/or disclosed by Carnegie Mellon to others\noutside of Carnegie Mellon.  However, your name, address, contact information\nand other direct personal identifiers in this consent form will not be mentioned\nin any such publication or dissemination of the research data and/or results by\nCarnegie Mellon.</p>\n\n<h2>Right to Ask Questions and Contact Information</h2>\n\n<p>If you have any questions about this study, please ask them now.  If you have\nquestions later, desire additional information, or wish to withdraw\nparticipation please contact:</p>\n\n<address>\nSteven Dang<br>\nHuman Computer Interaction Institute<br>\nCAMPUS ADDRESS<br>\nCarnegie Mellon University<br>\nPittsburgh, PA 15213<br>\nstevenda@andrew.cmu.edu<br>\n</address>\n\n<p>If you have questions pertaining to your rights as a research participant; or\nto report objections to this study, please contact:</p>\n\n<address>\nIRB Chair<br>\nRegulatory Compliance Administration<br>\nCarnegie Mellon University<br>\n5000 Forbes Avenue<br>\nWarner Hall, 4th Floor<br>\nPittsburgh, PA  15213<br>\nirb-review@andrew.cmu.edu<br>\n(412) 268-1901 or (412) 268 4727<br>\n</address>\n\n<h2>Voluntary Participation</h2>\n\n<p>Your participation in this research is voluntary.  You may discontinue\nparticipation at any time during the research activity.</p>\n\n<p>By clicking continue below you certify the following:</p>\n<ul>\n<li>You are 18 years of age or older.</li>\n<li>You have read and understand the information above.</li>\n<li>You want to participate in this research and continue with the brainstorming study.</li>\n</ul>\n\n</div>\n</div>\n</div>');
}));

Template.__define__("CPFooter", (function() {
  var view = this;
  return HTML.Raw('<center>\n    <button id="nextPage" class="btn btn-xlarge2 btn-default btn-primary nextPage">\n      Continue\n    </button>\n  </center>');
}));

Template.__define__("ConsentPageOld", (function() {
  var view = this;
  return HTML.DIV({
    "class": "container-fluid"
  }, "\n", HTML.DIV({
    "class": "row-fluid"
  }, "\n", HTML.DIV({
    "class": "span10 offset1"
  }, "\n", HTML.Raw("<h2>Participant Consent</h2>"), "\n\n", HTML.Raw("<p>This design strategy study is part of a research study conducted by\nChristopher MacLellan, Steven Dow, Ken Koedinger, and Steven Dang \nat Carnegie Mellon University.</p>"), "\n\n", HTML.Raw("<p>The purpose of this study is to investigate the use of different ideation\nstrategies on design outcomes.</p>"), "\n\n", HTML.Raw("<h2>Procedures</h2>"), "\n\n", HTML.Raw("<p>During this study, you will be asked complete a series of user interface\ndesign tasks. These tasks consist of coming up with ideas for various cell-phone\napplications and building low-fidelity prototypes to represent these ideas. If\nat any time you become frustrated or no longer want to participate, you may\nexit the session, and your compensation will be pro-rated according to your progress\nin the study.</p>"), "\n\n", HTML.Raw("<p>We plan to keep your identity private, and separate from the information we\ncollect. Your name will be replaced by a code name in all publications and\npresentations that are released to the public.</p>"), "\n\n", HTML.Raw("<h2>Expected Duration and Location</h2>"), "\n\n", HTML.Raw("<p>Your participation will involve a single 1-hour session. This experiment will take\nplace online.</p>"), "\n\n", HTML.Raw("<h2>Participant Requirements</h2>"), "\n\n", HTML.Raw("<p>Participants must be over 18 years old.</p>"), "\n\n", HTML.Raw("<h2>Risks</h2>"), "\n\n", HTML.Raw("<p>The risks and discomfort associated with participation in this study are no\ngreater than those ordinarily encountered in daily life or during the\nperformance of routine physical or psychological examinations or tests.</p>"), "\n\n", HTML.Raw("<h2>Rights</h2>"), "\n\n", HTML.Raw("<p>Your decision to participate in this study is voluntary.  You are free to\nstop participation at any point.  Refusal to participate, withdrawal of your\nconsent or discontinued participation in the study will not result in any\npenalty or loss of benefits or rights to which you might otherwise be entitled.\nThe Principal Investigator may at his/her discretion remove you from the study\nfor any of a number of reasons.  In such an event, you will not suffer any\npenalty or loss of benefits or rights to which you might otherwise be\nentitled.</p>"), "\n\n", HTML.Raw("<h2>Benefits</h2>"), "\n", HTML.Raw("<p>You may receive benefits from participation in the study, such as learning\nmore about design principles. Additionally, the knowledge gained in this study\nmay help improve methods of design education.</p>"), "\n\n", HTML.Raw("<h2>Compensation &amp; Costs</h2>"), "\n", HTML.Raw("<p>We are providing $10 gift cards as compensation. There is no \nadditional cost to you for participating in this study.</p>"), "\n\n", HTML.Raw("<h2>Confidentiality</h2>"), "\n", HTML.Raw("<p>By participating in the study, you understand and agree that Carnegie Mellon\nmay be required to disclose this consent form, data and other personally\nidentifiable information as required by law, regulation, subpoena or court\norder.  Otherwise, your confidentiality will be maintained in the following\nmanner:</p>"), "\n\n", HTML.Raw("<p>To ensure that participants information is kept confidential, the\nresearchers will assign each participant a unique code and will refer to any\ndata collected during the study by that code. By participating, you understand\nand agree that the data and information gathered during this study may be used\nby Carnegie Mellon and published and/or disclosed by Carnegie Mellon to others\noutside of Carnegie Mellon.  However, your name, address, contact information\nand other direct personal identifiers in this consent form will not be mentioned\nin any such publication or dissemination of the research data and/or results by\nCarnegie Mellon.</p>"), "\n\n", HTML.Raw("<h2>Right to Ask Questions and Contact Information</h2>"), "\n\n", HTML.Raw("<p>If you have any questions about this study, please ask them now.  If you have\nquestions later, desire additional information, or wish to withdraw\nparticipation please contact:</p>"), "\n\n", HTML.Raw("<address>\nChristopher MacLellan<br>\nHuman Computer Interaction Institute<br>\nCAMPUS ADDRESS<br>\nCarnegie Mellon University<br>\nPittsburgh, PA 15213<br>\n307-220-2425<br>\ncmaclell@cs.cmu.edu<br>\n</address>"), "\n\n", HTML.Raw("<p>If you have questions pertaining to your rights as a research participant; or\nto report objections to this study, please contact:</p>"), "\n\n", HTML.Raw("<address>\nIRB Chair<br>\nRegulatory Compliance Administration<br>\nCarnegie Mellon University<br>\n5000 Forbes Avenue<br>\nWarner Hall, 4th Floor<br>\nPittsburgh, PA  15213<br>\nirb-review@andrew.cmu.edu<br>\n(412) 268-1901 or (412) 268 4727<br>\n</address>"), "\n\n", HTML.Raw("<h2>Voluntary Participation</h2>"), "\n\n", HTML.Raw("<p>Your participation in this research is voluntary.  You may discontinue\nparticipation at any time during the research activity.</p>"), "\n\n", HTML.Raw("<p>By clicking continue below you certify the following:</p>"), "\n", HTML.Raw("<ul>\n<li>You are 18 years of age or older.</li>\n<li>You have read and understand the information above.</li>\n<li>You want to participate in this research and continue with the\ngroup brainstorming study.</li>\n</ul>"), "\n\n", HTML.Raw('<noscript>\n&lt;h1 style="color:red"&gt;You do not have Javascript enabled, you must have javascript enabled to continue with the study.&lt;/h1&gt;\n</noscript>'), "\n", HTML.Raw('<!--[if lte IE 8]>\n<h1 style="color:red">We detected that you are using an older version of Internet Explore (before IE 8). You will need a modern browsers to continue with the study (chrome, mozilla, safari, or IE 9 or above).</h1>\n<![endif]-->'), "\n", HTML.SCRIPT('\n$(function(){\ncheck = false;\n(function(a){if(/(android|bb\\d+|meego).+mobile|avantgo|bada\\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\\-(n|u)|c55\\/|capi|ccwa|cdm\\-|cell|chtm|cldc|cmd\\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\\-s|devi|dica|dmob|do(c|p)o|ds(12|\\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\\-|_)|g1 u|g560|gene|gf\\-5|g\\-mo|go(\\.w|od)|gr(ad|un)|haie|hcit|hd\\-(m|p|t)|hei\\-|hi(pt|ta)|hp( i|ip)|hs\\-c|ht(c(\\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\\-(20|go|ma)|i230|iac( |\\-|\\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\\/)|klon|kpt |kwc\\-|kyo(c|k)|le(no|xi)|lg( g|\\/(k|l|u)|50|54|\\-[a-w])|libw|lynx|m1\\-w|m3ga|m50\\/|ma(te|ui|xo)|mc(01|21|ca)|m\\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\\-2|po(ck|rt|se)|prox|psio|pt\\-g|qa\\-a|qc(07|12|21|32|60|\\-[2-7]|i\\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\\-|oo|p\\-)|sdk\\/|se(c(\\-|0|1)|47|mc|nd|ri)|sgh\\-|shar|sie(\\-|m)|sk\\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\\-|v\\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\\-|tdg\\-|tel(i|m)|tim\\-|t\\-mo|to(pl|sh)|ts(70|m\\-|m3|m5)|tx\\-9|up(\\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\\-|your|zeto|zte\\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);\nif (check){\nalert("You must use a desktop browser for this study. Please switch to a desktop before continuing.");\n}\n});\n'), "\n\n", HTML.Raw('<!--\n<form action="/problem-formulator/Study/consent" class="form-horizontal" id="UserConsentForm" method="post" accept-charset="utf-8" _lpchecked="1"><div style="display:none;"><input type="hidden" name="_method" value="POST"></div>            <fieldset>\n<legend></legend>\n<label for="UserFirstname" class="control-label">First name</label><div class="control-group required"><div class="controls"><input name="data[User][firstname]" maxlength="50" type="text" id="UserFirstname" required="required" style="cursor: auto; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABHklEQVQ4EaVTO26DQBD1ohQWaS2lg9JybZ+AK7hNwx2oIoVf4UPQ0Lj1FdKktevIpel8AKNUkDcWMxpgSaIEaTVv3sx7uztiTdu2s/98DywOw3Dued4Who/M2aIx5lZV1aEsy0+qiwHELyi+Ytl0PQ69SxAxkWIA4RMRTdNsKE59juMcuZd6xIAFeZ6fGCdJ8kY4y7KAuTRNGd7jyEBXsdOPE3a0QGPsniOnnYMO67LgSQN9T41F2QGrQRRFCwyzoIF2qyBuKKbcOgPXdVeY9rMWgNsjf9ccYesJhk3f5dYT1HX9gR0LLQR30TnjkUEcx2uIuS4RnI+aj6sJR0AM8AaumPaM/rRehyWhXqbFAA9kh3/8/NvHxAYGAsZ/il8IalkCLBfNVAAAAABJRU5ErkJggg==); background-attachment: scroll; background-position: 100% 50%; background-repeat: no-repeat;"></div></div><label for="UserLastname" class="control-label">Last name</label><div class="control-group required"><div class="controls"><input name="data[User][lastname]" maxlength="50" type="text" id="UserLastname" required="required"></div></div><div class="control-group required"><label for="UserEmail" class="control-label">Email</label><div class="controls"><input name="data[User][email]" maxlength="100" type="email" id="UserEmail" required="required"></div></div><input type="hidden" name="data[User][password]" value="password" id="UserPassword"><div class="controls"><button type="submit" class="btn btn-primary">Continue</button></div><input type="hidden" name="data[User][agree]" value="1" id="UserAgree">            </fieldset>\n</form>\n-->'), "\n\n", HTML.Raw("<!--\n<form class='form-inline' action='ontology_training' style=\"margin-bottom: 100px\">\n<div class=\"input-prepend\">\n<span class=\"add-on\"><i class=\"icon-pencil\"></i></span>\n<input id=\"name\" type='text' class='input-large' \nplaceholder='Your name here' required>\n</div>\n<button id=\"next-btn\" class='btn btn-primary'>Continue</button>\n</form>\n-->"), "\n", HTML.Raw('<button id="nextPage" class="btn btn-xlarge2 btn-default btn-primary nextPage">Continue</button>'), "\n"), "\n"), "\n");
}));

})();
