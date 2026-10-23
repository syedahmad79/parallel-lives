import type { Choice, Scenario } from "./model";
const c = (
  id: string,
  label: string,
  detail: string,
  consequence: string,
  effects: Choice["effects"],
  flag: string,
  requires?: Choice["requires"],
  unavailable?: string,
): Choice => ({
  id,
  label,
  detail,
  consequence,
  effects,
  flag,
  requires,
  unavailable,
});
export const scenarios: Scenario[] = [
  {
    id: "abroad",
    title: "Move Abroad",
    subtitle: "A one-way ticket. An unfamiliar version of yourself.",
    location: "A city across the water",
    color: "#a7a0dc",
    intro:
      "The ticket is still open on your screen. Beyond it: a room you have never slept in, a language you cannot yet dream in, and a life that will continue here without you. In this timeline, you board the plane.",
    motif: [
      "Rain draws a map on the train window.",
      "Somewhere downstairs, someone is learning the piano.",
      "A blue cup on the windowsill catches the last light.",
    ],
    scenes: [
      {
        id: "arrival",
        time: "Month 01",
        title: "A room with someone else’s view",
        body: [
          "Your suitcase catches on the fourth stair. Upstairs, the room is smaller than the photographs, but the window opens onto a courtyard where people leave their bicycles unlocked. For the first time all day, you stop translating everything into what it cost you to leave.",
          "Mara, the neighbor across the landing, knocks with two bowls of soup. She runs a repair workshop on Saturdays. An email arrives at the same moment: your new manager needs someone for a demanding six-week project. Back home, your sibling has sent a photograph of your empty chair at dinner. There is room for a beginning. There is not room for every beginning at once.",
        ],
        echoes: [],
        choices: [
          c(
            "work",
            "Take the demanding project",
            "A foothold at work, at the cost of your first free evenings.",
            "You became dependable at work before anyone in the courtyard learned your name.",
            { ambition: 2, stability: 1, connection: -1 },
            "work",
          ),
          c(
            "neighbors",
            "Accept Mara’s invitation",
            "Build a local life before building a reputation.",
            "Mara saved you a seat at the workshop; your manager gave the project to someone else.",
            { connection: 2, fulfillment: 1, ambition: -1 },
            "neighbors",
          ),
          c(
            "wander",
            "Give yourself a month to wander",
            "Use part of your savings to arrive slowly.",
            "You learned the city by walking it, while your financial cushion grew thinner.",
            { freedom: 2, fulfillment: 1, stability: -1 },
            "wander",
          ),
        ],
      },
      {
        id: "language",
        time: "Month 04",
        title: "The things you cannot translate",
        body: [
          "At the bakery you tell the cashier you are lonely when you mean to say you are alone. She gives you an extra roll. You carry it home in your pocket, embarrassed by the kindness and grateful for it.",
          "Your sibling calls to say the family shop is struggling. They say they are only keeping you informed, then ask when you might visit. Mara sees you on the stairs after the call. “It takes a while,” she says. She could mean the language, or the place, or the strange guilt of having wanted this.",
        ],
        echoes: [
          {
            when: { flag: "work" },
            text: "The project bonus could pay for a flight. Your manager assumes you will use it to settle in.",
          },
          {
            when: { flag: "neighbors" },
            text: "At the workshop, someone has written your name correctly on a mug. It makes the call home harder, not easier.",
          },
          {
            when: { flag: "wander" },
            text: "You know three routes to the river now. None makes the distance home feel shorter.",
          },
        ],
        choices: [
          c(
            "visit",
            "Go home for two weeks",
            "Spend your travel reserve and be useful in person.",
            "You helped reopen the shop; returning abroad felt like leaving for the first time again.",
            { connection: 2, stability: -1 },
            "home",
          ),
          c(
            "lessons",
            "Stay and join a language class",
            "Accept that belonging takes repeated, ordinary effort.",
            "You missed the reopening, but gained the words to tell Mara why you were sad.",
            { connection: 1, freedom: 1, fulfillment: 1 },
            "language",
          ),
          c(
            "send",
            "Send money and stay at work",
            "Offer practical support while holding your course.",
            "The money kept the lights on at home. Your sibling wished you could have been there too.",
            { ambition: 1, stability: -1, connection: 1 },
            "support",
          ),
        ],
      },
      {
        id: "offer",
        time: "Year 01",
        title: "An offer with an asterisk",
        body: [
          "A job opens in another district. The salary would make rent unremarkable. The contract includes evenings, travel, and a start date before the courtyard’s summer meal. You have begun to recognize how often opportunity arrives disguised as a scheduling conflict.",
          "Mara is trying to keep the workshop open after its landlord raises the rent. She asks you to help negotiate. You are not the only person she could ask. That is what makes it feel like trust.",
        ],
        echoes: [
          {
            when: { flag: "work" },
            text: "Your six-week project is the reason the recruiter called. The reputation you built is opening a door with familiar costs.",
          },
          {
            when: { flag: "home" },
            text: "Your sibling says you sound different now. You cannot tell whether it is a compliment.",
          },
          {
            when: { flag: "language" },
            text: "You can finally argue politely in the local language. For the workshop, that is a surprisingly valuable skill.",
          },
        ],
        choices: [
          c(
            "promotion",
            "Accept the new role",
            "Choose financial breathing room and a more crowded calendar.",
            "Your address stayed the same, but your days moved out of the neighborhood.",
            { ambition: 3, stability: 2, connection: -1, freedom: -1 },
            "promotion",
          ),
          c(
            "roots",
            "Help keep the workshop open",
            "Stay in your current job and spend your evenings with Mara.",
            "You negotiated a shorter lease. The workshop survived, precariously, with your name on its rota.",
            { connection: 2, fulfillment: 2, ambition: -1 },
            "roots",
          ),
          c(
            "independent",
            "Try independent contract work",
            "Trade the offer for control over your days.",
            "You gained your afternoons and learned to live with invoices that arrived late.",
            { freedom: 3, stability: -2, ambition: 1 },
            "independent",
          ),
        ],
      },
      {
        id: "winter",
        time: "Year 02",
        title: "The winter nobody photographs",
        body: [
          "The first winter was an adventure. The second is weather. A leak blooms on your ceiling. Your sibling announces a small wedding, on a weekday, back home. Mara leaves a spare key under your door because her father is ill and she may need to go away.",
          "You had imagined becoming a person who could be everywhere they were needed. Instead, there are three calendars on the kitchen table and one of you. The question is no longer whether this city is right. It is which obligations you are willing to call your own.",
        ],
        echoes: [
          {
            when: { flag: "promotion" },
            text: "Your new employer approves the wedding leave, then asks you to take a laptop. Security has not bought you absence.",
          },
          {
            when: { flag: "roots" },
            text: "The workshop regulars offer to cover your shifts. Being needed, you discover, can include being allowed to leave.",
          },
          {
            when: { flag: "independent" },
            text: "You can travel whenever you like. You cannot bill for the days you spend traveling.",
          },
        ],
        choices: [
          c(
            "family",
            "Travel for the wedding",
            "Let work wait and accept the cost.",
            "You stood beside your sibling. A client or colleague learned they could continue without you.",
            { connection: 2, ambition: -1, stability: -1 },
            "family",
          ),
          c(
            "anchor",
            "Stay and care for the life here",
            "Help Mara and attend the wedding by video.",
            "Mara returned to watered plants and a repaired window. Your family photograph included a phone.",
            { connection: 1, stability: 1, fulfillment: 1 },
            "anchor",
          ),
          c(
            "boundary",
            "Ask everyone for a smaller promise",
            "Decline extra work, send a speech, and help Mara find backup.",
            "Some people were disappointed. For once, you did not make a promise your body could not keep.",
            { freedom: 2, fulfillment: 2, ambition: -1 },
            "boundary",
          ),
        ],
      },
      {
        id: "home",
        time: "Year 03",
        title: "Two keys on the same ring",
        body: [
          "Your residence renewal arrives beside a letter from your sibling. There is a role for you at the shop, if you want it. Not an emergency this time. An invitation. Mara’s workshop has a new lease; your corner of the courtyard has begun to feel inevitable, though you remember when none of it existed.",
          "You set your old house key beside the one Mara gave you. Neither opens every door. Both have the weight of a life that could continue. You can stay, return, or try to build a rhythm between places. Whatever you choose will leave someone waving from a platform.",
        ],
        echoes: [
          {
            when: { flag: "family" },
            text: "At the wedding, you stopped describing home as somewhere you had escaped. That change has stayed with you.",
          },
          {
            when: { flag: "boundary" },
            text: "The smaller promises have held. You trust their size now.",
          },
        ],
        choices: [
          c(
            "stay",
            "Put down roots here",
            "Renew your residence and commit to the city’s ordinary days.",
            "You renewed your residence and made the courtyard your permanent address.",
            { connection: 1, stability: 2 },
            "end-stay",
          ),
          c(
            "return",
            "Bring this version of yourself home",
            "Return without pretending the journey was a mistake.",
            "You booked a return ticket and made room for what had changed in you.",
            { connection: 2, fulfillment: 1, freedom: -1 },
            "end-return",
          ),
          c(
            "bridge",
            "Build a life between places",
            "Use the independence you created to split your year.",
            "You kept two keys and began the difficult work of making two calendars honest.",
            { freedom: 2, stability: -1 },
            "end-bridge",
            { attribute: "freedom", min: 7 },
            "Requires freedom of 7: earlier choices must create room for a flexible life.",
          ),
        ],
      },
    ],
    endings: [
      {
        id: "end-stay",
        title: "The Place That Learned Your Name",
        quote: "Belonging arrived quietly, then stayed.",
        paragraphs: [
          "Years later, you give directions without thinking. You complain about the trains. Mara asks you to collect a parcel, and you realize this is the kind of trust you crossed an ocean to find, although you could not have named it then.",
          "Home still has a time difference. There are birthdays you miss and jokes you need explained. Staying does not cure the ache of elsewhere. It gives the ache a kitchen, a circle of friends, a place to put down its coat.",
        ],
        reflection:
          "What ordinary thing would make a new place feel like yours?",
      },
      {
        id: "end-return",
        title: "The Distance You Brought Home",
        quote: "Returning can be its own kind of departure.",
        paragraphs: [
          "The shop smells exactly as you remembered. You do not. You change its opening hours, paint a wall, and refuse an old argument with an unfamiliar calm. Your sibling notices before you do: you have come back, but you have not gone backward.",
          "Mara sends photographs of the courtyard. Sometimes you search flight prices without buying. The city remains a real place where a real version of you existed. You no longer need to live there to believe in that person.",
        ],
        reflection:
          "What could you bring back without giving up who you became?",
      },
      {
        id: "end-bridge",
        title: "A Life in Two Time Zones",
        quote: "You made a home out of the crossing.",
        paragraphs: [
          "Your calendar has seasons instead of a single address. Some months begin above the family shop; others begin with Mara calling from the landing. The arrangement is less romantic than people imagine: paperwork, luggage, missed connections, a careful reckoning of costs.",
          "There are days when both places feel far away. There are also days when you carry something useful from one into the other. You have traded the ease of one home for the unfinished work of two. It is not weightless. It is yours.",
        ],
        reflection: "Which kind of distance are you willing to live with?",
      },
    ],
  },
  {
    id: "passion",
    title: "Follow Your Passion",
    subtitle: "The quiet dream that never quite went away.",
    location: "A studio above the everyday",
    color: "#d1b18c",
    intro:
      "For years you have said “when there is time.” In this timeline, you take the sketchbooks out of the drawer and give the work a date. There is no sudden certainty. There is a table, a blank page, and an evening you decide to protect.",
    motif: [
      "The desk lamp leaves a small circle of gold.",
      "Someone has pinned a crooked postcard above the sink.",
      "You find a streak of blue paint on your sleeve.",
    ],
    scenes: [
      {
        id: "space",
        time: "Week 01",
        title: "A room for the unfinished",
        body: [
          "The studio above the print shop smells of paper and old radiators. Inez, who rents the other half, shows you where the ceiling leaks. “Nothing important under that patch,” she says. Then she looks at your sketchbook. “Or anything you’re pretending isn’t important.”",
          "You want to make an illustrated book about the people who keep a city running before sunrise. Your current job pays reliably. The studio does not. Before there is an audience or a first page worth keeping, there is the unglamorous question of how you will buy time.",
        ],
        echoes: [],
        choices: [
          c(
            "evenings",
            "Protect two evenings a week",
            "Keep your job and accept a slower beginning.",
            "Your salary paid for paper. The project grew in narrow, stubborn increments.",
            { stability: 2, fulfillment: 1, freedom: -1 },
            "evenings",
          ),
          c(
            "parttime",
            "Negotiate a shorter working week",
            "Spend some financial security on uninterrupted time.",
            "Your manager agreed to fewer hours. You learned how expensive an empty Wednesday could feel.",
            { freedom: 2, fulfillment: 1, stability: -1 },
            "parttime",
          ),
          c(
            "leap",
            "Use your savings for a season",
            "Give the work three months and a firm financial limit.",
            "You marked a return-to-work date on the calendar, then began in earnest.",
            { ambition: 2, freedom: 2, stability: -2 },
            "leap",
          ),
        ],
      },
      {
        id: "voice",
        time: "Month 03",
        title: "Someone else’s version of your dream",
        body: [
          "An editor likes the drawings but wants a different book: cheerful city scenes, fewer tired faces, something easier to give as a present. The fee would cover months of studio rent. Inez reads the email twice and says, “You are allowed to want to be paid.”",
          "You think of the cleaner who let you draw her at the end of a shift. She asked whether the book would show how tired she was. You said you hoped it would. There are promises in the sketchbook that no contract mentions.",
        ],
        echoes: [
          {
            when: { flag: "leap" },
            text: "The date on your calendar is now six weeks away. The offer has the sharp outline of relief.",
          },
          {
            when: { flag: "evenings" },
            text: "Your job makes refusal possible. It also makes another year of evening work very easy to imagine.",
          },
        ],
        choices: [
          c(
            "commercial",
            "Accept the brighter commission",
            "Learn the craft inside a commercial constraint.",
            "You signed the contract, keeping the original drawings in a separate folder.",
            { stability: 2, ambition: 2, fulfillment: -1 },
            "commercial",
          ),
          c(
            "truth",
            "Keep the difficult book",
            "Publish a small edition yourself and pay for printing.",
            "The first print run was small enough to carry home. Every face remained.",
            { fulfillment: 2, freedom: 1, stability: -2 },
            "truth",
          ),
          c(
            "collective",
            "Invite the subjects to shape it",
            "Share authorship, credit, and the pace of the work.",
            "The book became slower and less entirely yours. The cleaner rewrote her own caption.",
            { connection: 2, fulfillment: 1, ambition: -1 },
            "collective",
          ),
        ],
      },
      {
        id: "opening",
        time: "Month 07",
        title: "Twelve people in a room",
        body: [
          "The first public showing brings twelve people, including someone who came in to ask for directions. Inez has arranged the pages with more care than you could bear to give them. There is a moment before the doors open when you wish the whole thing would be canceled.",
          "One visitor looks at the same drawing for a long time. A gallery owner leaves a card. Your friend texts to ask whether you are still coming to dinner. You have begun to treat every ordinary invitation as time stolen from the work. Tonight, you can hear how lonely that sounds.",
        ],
        echoes: [
          {
            when: { flag: "commercial" },
            text: "The gallery owner recognizes the commissioned cover. The work you compromised on has brought someone to the work you did not.",
          },
          {
            when: { flag: "truth" },
            text: "The cleaner brings her daughter. They stand together in front of the page you refused to soften.",
          },
          {
            when: { flag: "collective" },
            text: "The contributors take turns speaking. For once, you are not responsible for every explanation.",
          },
        ],
        choices: [
          c(
            "network",
            "Stay late with the gallery owner",
            "Pursue the opening while it is here.",
            "A solo exhibition became possible. Your friend ate dinner without you.",
            { ambition: 2, connection: -1 },
            "network",
          ),
          c(
            "dinner",
            "Leave on time for your friend",
            "Let the work be one part of a whole life.",
            "You arrived with ink on your hands. The conversation was not about your project, and you needed that.",
            { connection: 2, fulfillment: 1, ambition: -1 },
            "dinner",
          ),
          c(
            "workshop",
            "Offer a community drawing session",
            "Turn the room into a place other people can use.",
            "Six people returned the next week. One brought pencils for everyone.",
            { connection: 2, fulfillment: 2, stability: -1 },
            "workshop",
          ),
        ],
      },
      {
        id: "cost",
        time: "Year 01",
        title: "The price of being seen",
        body: [
          "The print shop is being sold. Inez cannot afford the new rent. At the same time, a residency offers you six months away, with a stipend that covers the basics and little more. You read the letter sitting on the floor, surrounded by work that once fitted in a drawer.",
          "Inez says she will be all right. You know she is trying to release you from a debt you never agreed was a debt. There is an empty classroom nearby that could become a shared studio, if someone does the organizing. There is also your old manager’s offer of steady work.",
        ],
        echoes: [
          {
            when: { flag: "workshop" },
            text: "The drawing group offers to help with the classroom deposit. What you gave away has become a kind of support.",
          },
          {
            when: { flag: "network" },
            text: "The gallery owner wrote your residency recommendation. That missed dinner is part of how this letter reached you.",
          },
          {
            when: { flag: "dinner" },
            text: "Your friend comes to help pack. They do not ask whether the project has succeeded.",
          },
        ],
        choices: [
          c(
            "residency",
            "Take the residency",
            "Leave the familiar room and give the work another season.",
            "Inez helped load the van. You promised visits, carefully, without promising every weekend.",
            { ambition: 2, freedom: 1, connection: -1, stability: -1 },
            "residency",
          ),
          c(
            "shared",
            "Organize the shared studio",
            "Build a structure that can hold more than your own work.",
            "The classroom opened with mismatched tables and a rota nobody loved but everyone used.",
            { connection: 2, fulfillment: 1, freedom: -1 },
            "shared",
          ),
          c(
            "steady",
            "Return to steady work",
            "Protect the practice by removing its obligation to pay.",
            "You accepted the job and kept one table at home clear.",
            { stability: 3, ambition: -1, freedom: -1 },
            "steady",
          ),
        ],
      },
      {
        id: "definition",
        time: "Year 03",
        title: "What counts as a life’s work",
        body: [
          "A new notebook waits on your desk. The first book exists now: imperfect, finite, capable of being held by somebody who has never met you. Making it did not settle the question of who you are. It gave the question better company.",
          "Inez asks what comes next. You could pursue the larger exhibition circuit, anchor your practice in shared spaces, or let drawing remain a private, durable part of an otherwise ordinary life. None of these choices erases the book. None guarantees another.",
        ],
        echoes: [
          {
            when: { flag: "residency" },
            text: "The residency taught you what solitude can make possible, and what it cannot give back.",
          },
          {
            when: { flag: "shared" },
            text: "Someone has left a new set of keys to the classroom on your desk. You are no longer its only keeper.",
          },
          {
            when: { flag: "steady" },
            text: "You draw more slowly now. You have also stopped checking whether every drawing could sell.",
          },
        ],
        choices: [
          c(
            "artist",
            "Build your life around the work",
            "Keep pursuing an audience and accept an uncertain livelihood.",
            "You submitted the next proposal and made a budget with room for rejection.",
            { ambition: 2, stability: -1 },
            "end-artist",
          ),
          c(
            "community",
            "Make a place for other makers",
            "Let the practice grow through shared teaching and space.",
            "You put other names beside yours on the studio door.",
            { connection: 2, fulfillment: 1 },
            "end-community",
            { attribute: "connection", min: 7 },
            "Requires connection of 7: build relationships that can sustain a shared practice.",
          ),
          c(
            "private",
            "Keep a small, faithful practice",
            "Choose a livelihood that gives the work somewhere to return.",
            "You protected a weekly appointment with the empty page.",
            { stability: 2, fulfillment: 1 },
            "end-private",
          ),
        ],
      },
    ],
    endings: [
      {
        id: "end-artist",
        title: "The Work That Became a Life",
        quote: "You stopped waiting to be certain.",
        paragraphs: [
          "Your name appears in print, sometimes small, sometimes spelled wrong. Some exhibitions lead to another; some lead nowhere. You learn to separate a rejected proposal from a rejected self, although the distinction never becomes effortless.",
          "Inez visits an opening and points out a detail she remembers from the first sketchbook. The room is larger now. The work still begins in the same way: alone at a table, choosing to notice. You have made a livelihood with seams in it. Through those seams, a particular light gets in.",
        ],
        reflection:
          "What uncertainty would you accept for work that feels like yours?",
      },
      {
        id: "end-community",
        title: "A Room With the Lights Left On",
        quote: "Your dream grew when it made room.",
        paragraphs: [
          "There are more pencils than chairs in the studio. You spend some mornings negotiating invoices instead of drawing. The book you once imagined making next is still unfinished. Beside it sit six small books made by people who had never thought to call themselves artists.",
          "Inez keeps the spare key. The cleaner’s daughter runs a session on lettering. Your work has become difficult to separate from the place that holds it. You gave up some solitude, some visibility, and the pleasure of sole authorship. You gained witnesses.",
        ],
        reflection:
          "Who else might find room inside a dream you have kept to yourself?",
      },
      {
        id: "end-private",
        title: "The Quiet Thing You Kept",
        quote: "Not every calling needs an audience.",
        paragraphs: [
          "Your job title does not mention art. The table by the window does. On Sundays you draw the people at the bus stop, the chipped bowl, Inez asleep on the train. Some pages are good. Most are simply evidence that you were paying attention.",
          "Occasionally you wonder what a larger career might have looked like. Then someone borrows the book, returns it with a folded page, and tells you what they saw. The work has a life beyond you, even without becoming the whole of your life.",
        ],
        reflection:
          "What would you still make if nobody asked you to prove its value?",
      },
    ],
  },
  {
    id: "risk",
    title: "Take the Risk",
    subtitle: "A fragile idea. A future without a guarantee.",
    location: "An empty shop on the corner",
    color: "#8fbdbd",
    intro:
      "The empty shop on the corner has been empty for years. In this timeline, you stop walking past it. You and your friend Dev imagine a repair café: a place where broken things are worth the trouble. Then you find out what the rent is.",
    motif: [
      "A small brass bell hangs above the door.",
      "Sunlight settles on the workbench like sawdust.",
      "The clock over the counter is seven minutes slow.",
    ],
    scenes: [
      {
        id: "begin",
        time: "Day 01",
        title: "The idea becomes a number",
        body: [
          "Dev draws the floor plan on the back of an envelope. Three benches, a kettle, shelves for parts. You have known each other long enough to recognize the moment his excitement starts doing the arithmetic for him.",
          "The landlord will hold the shop until Friday. A full lease would make the café real immediately. A weekend stall would test the idea without giving it a permanent home. You could also invite neighbors to become members before there is anything to join. Each beginning asks for a different kind of trust.",
        ],
        echoes: [],
        choices: [
          c(
            "lease",
            "Sign a short lease with your savings",
            "Commit to a visible place and a fixed monthly cost.",
            "The keys were yours. So was the rent, including on days nobody came.",
            { ambition: 2, freedom: 1, stability: -2 },
            "lease",
          ),
          c(
            "pilot",
            "Run a weekend pilot",
            "Keep your income and test what people actually need.",
            "You borrowed folding tables. Progress was slower than Dev hoped, and cheaper than you feared.",
            { stability: 2, freedom: -1 },
            "pilot",
          ),
          c(
            "members",
            "Start with founding members",
            "Share ownership of the idea from the beginning.",
            "Twenty neighbors pledged small amounts and arrived with twenty opinions.",
            { connection: 2, stability: 1, freedom: -1 },
            "members",
          ),
        ],
      },
      {
        id: "breakage",
        time: "Month 03",
        title: "The first thing you cannot fix",
        body: [
          "A customer leaves a radio that belonged to her father. Dev promises it will be ready by Thursday. On Wednesday you discover the damaged component is no longer made. There is a replacement, but it will cost more than the repair fee.",
          "The customer has told her family the radio will play at a birthday dinner. The promise is now part of their evening. Dev rubs his eyes and says the business cannot survive if you pay for every sentimental object. He is right. So is the part of you that hates the sentence.",
        ],
        echoes: [
          {
            when: { flag: "lease" },
            text: "Rent is due next week. A generous gesture would come directly out of your cushion.",
          },
          {
            when: { flag: "members" },
            text: "One member knows a collector who might have the part. Asking will mean admitting the mistake.",
          },
        ],
        choices: [
          c(
            "pay",
            "Pay for the part yourself",
            "Honor the promise at a cost you cannot repeat often.",
            "The radio played at dinner. The month ended with less money than your spreadsheet expected.",
            { connection: 2, fulfillment: 1, stability: -2 },
            "pay",
          ),
          c(
            "honest",
            "Explain the limit and offer a refund",
            "Risk disappointment to make an honest agreement.",
            "The customer was upset, then accepted a later repair. Dev stopped promising dates without checking.",
            { stability: 1, fulfillment: 1 },
            "honest",
          ),
          c(
            "ask",
            "Ask the neighborhood for help",
            "Make the problem visible and invite a shared solution.",
            "A collector donated a part. The customer stayed to help serve tea the following Saturday.",
            { connection: 2, freedom: -1 },
            "ask",
          ),
        ],
      },
      {
        id: "scale",
        time: "Month 08",
        title: "A bigger version of the promise",
        body: [
          "A property company offers a contract to run repair events in its buildings. It would fill the calendar and pay promptly. It also requires branded uniforms, weekend availability, and priority over the café’s walk-in work.",
          "Dev sees salaries, proper tools, the end of counting coins after closing. You see those things too. You also see the customer with the radio waiting outside a locked door. Growth is not an enemy. But it has arrived with a schedule written by somebody else.",
        ],
        echoes: [
          {
            when: { flag: "pay" },
            text: "The radio customer recommended you to the company. An act you could barely afford is the reason the offer exists.",
          },
          {
            when: { flag: "honest" },
            text: "Dev asks how much you can honestly promise. It is the question you taught each other to ask.",
          },
          {
            when: { flag: "ask" },
            text: "Your volunteers ask whether the café will still belong to the neighborhood. You cannot answer with a slogan.",
          },
        ],
        choices: [
          c(
            "contract",
            "Accept the full contract",
            "Build a business capable of paying regular wages.",
            "The calendar filled. You posted new, shorter opening hours on the café door.",
            { ambition: 3, stability: 2, freedom: -1, connection: -1 },
            "contract",
          ),
          c(
            "limited",
            "Negotiate one event a month",
            "Take slower growth and leave space for the café.",
            "The company accepted a trial. Dev worried about the money and helped plan it anyway.",
            { stability: 1, connection: 1, freedom: 1 },
            "limited",
          ),
          c(
            "local",
            "Decline and deepen local membership",
            "Ask the neighborhood to sustain what it values.",
            "Members increased their contributions. Several could not afford to, and you kept their access.",
            { connection: 2, fulfillment: 1, stability: -1 },
            "local",
          ),
        ],
      },
      {
        id: "fracture",
        time: "Year 02",
        title: "Two people, two kinds of tired",
        body: [
          "Dev has been opening early and leaving late. You have been answering messages at the dinner table. When a delivery goes missing, the argument is technically about a box of switches. Neither of you believes that.",
          "Dev says he needs a reliable salary. You say you need a day when your phone does not feel like the front door. For the first time, you admit that the same project may not be able to give both of you what you need, at the same time, in the same form.",
        ],
        echoes: [
          {
            when: { flag: "contract" },
            text: "The contract covers wages, but its deadlines are eating the evenings those wages were meant to buy back.",
          },
          {
            when: { flag: "limited" },
            text: "Your compromise kept the door open. It did not eliminate the work of deciding what comes through it.",
          },
          {
            when: { flag: "local" },
            text: "Members offer extra shifts. Dev is grateful, then says volunteers cannot pay his rent.",
          },
        ],
        choices: [
          c(
            "systems",
            "Spend reserves on paid cover",
            "Give both of you breathing room before making a permanent decision.",
            "A part-time coordinator took over the rota. Your reserves shrank, and your conversations improved.",
            { stability: -1, connection: 2, freedom: 1 },
            "systems",
          ),
          c(
            "buyout",
            "Arrange for Dev to leave fairly",
            "Accept a smaller operation and a real goodbye.",
            "You agreed on payments you could sustain. Dev left a labeled toolbox and took a salaried job.",
            { ambition: 1, connection: -1, stability: -1, freedom: 1 },
            "buyout",
          ),
          c(
            "pause",
            "Pause new work for a month",
            "Let the numbers and the friendship have an honest reckoning.",
            "You turned down bookings. Over several difficult lunches, you finally wrote down what each of you needed.",
            { stability: -1, fulfillment: 2, connection: 1 },
            "pause",
          ),
        ],
      },
      {
        id: "future",
        time: "Year 03",
        title: "The door you can keep open",
        body: [
          "The lease is up for renewal. You know what the café costs now, in money and in attention. A box of thank-you notes sits under the counter. Beside it is a folder of bills. Neither tells the whole story.",
          "Dev comes in on a quiet morning. The bell rings, and for a moment you remember the envelope with the floor plan. You could professionalize the business, transfer its care to a cooperative, or close the permanent shop and carry the repair work into occasional events. The first risk was beginning. This one is choosing what should continue.",
        ],
        echoes: [
          {
            when: { flag: "systems" },
            text: "The coordinator has made the rota work without either of you being indispensable. It changes what is possible.",
          },
          {
            when: { flag: "buyout" },
            text: "Dev’s visit is no longer a shift. You are learning how to be friends outside the project.",
          },
          {
            when: { flag: "pause" },
            text: "The month of pause taught you that closing a door for a while did not erase what happened inside.",
          },
        ],
        choices: [
          c(
            "business",
            "Build a lasting small business",
            "Set prices, working hours, and limits that can pay people fairly.",
            "You renewed the lease with a plan that included salaries and closed days.",
            { ambition: 2, stability: 1 },
            "end-business",
          ),
          c(
            "coop",
            "Transfer it to a neighborhood cooperative",
            "Share decisions and surrender control of the original vision.",
            "Members elected a committee. You kept a vote, a key, and fewer final decisions.",
            { connection: 2, freedom: 1 },
            "end-coop",
            { attribute: "connection", min: 7 },
            "Requires connection of 7: a cooperative needs a community willing to carry it.",
          ),
          c(
            "close",
            "Close the shop with care",
            "Pay what you owe and keep the idea in a smaller form.",
            "You sold the benches, settled the bills, and kept one folding table.",
            { freedom: 2, fulfillment: 1 },
            "end-close",
          ),
        ],
      },
    ],
    endings: [
      {
        id: "end-business",
        title: "Something That Could Stand",
        quote: "Courage became a schedule you could keep.",
        paragraphs: [
          "The café closes on Mondays. At first this feels like failure; eventually it feels like a labor right. You charge more for some repairs, decline others, and pay the people who make the place possible. The dream has become less pure and more durable.",
          "Dev brings in a lamp one afternoon, as a customer. You talk while it warms on the bench. The business did not preserve the beginning. It survived by changing it. The brass bell still rings, and on most days somebody is there to answer.",
        ],
        reflection: "What boundaries would help something you love survive?",
      },
      {
        id: "end-coop",
        title: "The Idea That Outgrew You",
        quote: "You opened the door. Others kept it open.",
        paragraphs: [
          "The committee changes the opening hours. You disagree, lose the vote, and arrive for your shift anyway. The café has become a place with a life independent of its founders. That is what you wanted. Some days it still stings.",
          "Dev teaches a monthly session. A member repairs the bell. You no longer know every object that passes through the door, but you know the people who care for them. You traded a measure of authorship for the possibility that this might last beyond your energy.",
        ],
        reflection:
          "Could you let a good thing continue without being the person in charge?",
      },
      {
        id: "end-close",
        title: "The Courage to Leave the Door",
        quote: "An ending can carry something forward.",
        paragraphs: [
          "You sweep the empty shop once more before returning the key. There is grief in the clean rectangle where the workbench stood. There is also relief, and you decide not to make either feeling apologize for the other.",
          "Months later, you and Dev run a repair table at a neighborhood fair. Someone brings the radio. It still works; she just wanted you to know. The shop closed. The friendships, skills, and objects you saved did not. The risk made a real mark, even without becoming permanent.",
        ],
        reflection:
          "What could remain valuable even if it did not last forever?",
      },
    ],
  },
];
export const getScenario = (id: string) => {
  const scenario = scenarios.find((s) => s.id === id);
  if (!scenario) throw new Error("Unknown story template.");
  return scenario;
};
