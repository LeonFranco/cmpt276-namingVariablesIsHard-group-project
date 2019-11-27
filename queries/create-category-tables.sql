CREATE TABLE Categories
    (id SERIAL PRIMARY KEY,
     category TEXT UNIQUE NOT NULL,
     recognized INT DEFAULT 0,
     unrecognized INT DEFAULT 0);

CREATE OR REPLACE FUNCTION create_categories()
    RETURNS void AS
$$
DECLARE
    category_name TEXT;
    category_list TEXT[] := ARRAY [
['aircraft carrier'],
['airplane'],
['alarm clock'],
['ambulance'],
['angel'],
['animal migration'],
['ant'],
['anvil'],
['apple'],
['arm'],
['asparagus'],
['axe'],
['backpack'],
['banana'],
['bandage'],
['barn'],
['baseball'],
['baseball bat'],
['basket'],
['basketball'],
['bat'],
['bathtub'],
['beach'],
['bear'],
['beard'],
['bed'],
['bee'],
['belt'],
['bench'],
['bicycle'],
['binoculars'],
['bird'],
['birthday cake'],
['blackberry'],
['blueberry'],
['book'],
['boomerang'],
['bottlecap'],
['bowtie'],
['bracelet'],
['brain'],
['bread'],
['bridge'],
['broccoli'],
['broom'],
['bucket'],
['bulldozer'],
['bus'],
['bush'],
['butterfly'],
['cactus'],
['cake'],
['calculator'],
['calendar'],
['camel'],
['camera'],
['camouflage'],
['campfire'],
['candle'],
['cannon'],
['canoe'],
['car'],
['carrot'],
['castle'],
['cat'],
['ceiling fan'],
['cello'],
['cell phone'],
['chair'],
['chandelier'],
['church'],
['circle'],
['clarinet'],
['clock'],
['cloud'],
['coffee cup'],
['compass'],
['computer'],
['cookie'],
['cooler'],
['couch'],
['cow'],
['crab'],
['crayon'],
['crocodile'],
['crown'],
['cruise ship'],
['cup'],
['diamond'],
['dishwasher'],
['diving board'],
['dog'],
['dolphin'],
['donut'],
['door'],
['dragon'],
['dresser'],
['drill'],
['drums'],
['duck'],
['dumbbell'],
['ear'],
['elbow'],
['elephant'],
['envelope'],
['eraser'],
['eye'],
['eyeglasses'],
['face'],
['fan'],
['feather'],
['fence'],
['finger'],
['fire hydrant'],
['fireplace'],
['firetruck'],
['fish'],
['flamingo'],
['flashlight'],
['flip flops'],
['floor lamp'],
['flower'],
['flying saucer'],
['foot'],
['fork'],
['frog'],
['frying pan'],
['garden'],
['garden hose'],
['giraffe'],
['goatee'],
['golf club'],
['grapes'],
['grass'],
['guitar'],
['hamburger'],
['hammer'],
['hand'],
['harp'],
['hat'],
['headphones'],
['hedgehog'],
['helicopter'],
['helmet'],
['hexagon'],
['hockey puck'],
['hockey stick'],
['horse'],
['hospital'],
['hot air balloon'],
['hot dog'],
['hot tub'],
['hourglass'],
['house'],
['house plant'],
['hurricane'],
['ice cream'],
['jacket'],
['jail'],
['kangaroo'],
['key'],
['keyboard'],
['knee'],
['knife'],
['ladder'],
['lantern'],
['laptop'],
['leaf'],
['leg'],
['light bulb'],
['lighter'],
['lighthouse'],
['lightning'],
['line'],
['lion'],
['lipstick'],
['lobster'],
['lollipop'],
['mailbox'],
['map'],
['marker'],
['matches'],
['megaphone'],
['mermaid'],
['microphone'],
['microwave'],
['monkey'],
['moon'],
['mosquito'],
['motorbike'],
['mountain'],
['mouse'],
['moustache'],
['mouth'],
['mug'],
['mushroom'],
['nail'],
['necklace'],
['nose'],
['ocean'],
['octagon'],
['octopus'],
['onion'],
['oven'],
['owl'],
['paintbrush'],
['paint can'],
['palm tree'],
['panda'],
['pants'],
['paper clip'],
['parachute'],
['parrot'],
['passport'],
['peanut'],
['pear'],
['peas'],
['pencil'],
['penguin'],
['piano'],
['pickup truck'],
['picture frame'],
['pig'],
['pillow'],
['pineapple'],
['pizza'],
['pliers'],
['police car'],
['pond'],
['pool'],
['popsicle'],
['postcard'],
['potato'],
['power outlet'],
['purse'],
['rabbit'],
['raccoon'],
['radio'],
['rain'],
['rainbow'],
['rake'],
['remote control'],
['rhinoceros'],
['rifle'],
['river'],
['roller coaster'],
['rollerskates'],
['sailboat'],
['sandwich'],
['saw'],
['saxophone'],
['school bus'],
['scissors'],
['scorpion'],
['screwdriver'],
['sea turtle'],
['see saw'],
['shark'],
['sheep'],
['shoe'],
['shorts'],
['shovel'],
['sink'],
['skateboard'],
['skull'],
['skyscraper'],
['sleeping bag'],
['smiley face'],
['snail'],
['snake'],
['snorkel'],
['snowflake'],
['snowman'],
['soccer ball'],
['sock'],
['speedboat'],
['spider'],
['spoon'],
['spreadsheet'],
['square'],
['squiggle'],
['squirrel'],
['stairs'],
['star'],
['steak'],
['stereo'],
['stethoscope'],
['stitches'],
['stop sign'],
['stove'],
['strawberry'],
['streetlight'],
['string bean'],
['submarine'],
['suitcase'],
['sun'],
['swan'],
['sweater'],
['swing set'],
['sword'],
['syringe'],
['table'],
['teapot'],
['teddy-bear'],
['telephone'],
['television'],
['tennis racquet'],
['tent'],
['The Eiffel Tower'],
['The Great Wall of China'],
['The Mona Lisa'],
['tiger'],
['toaster'],
['toe'],
['toilet'],
['tooth'],
['toothbrush'],
['toothpaste'],
['tornado'],
['tractor'],
['traffic light'],
['train'],
['tree'],
['triangle'],
['trombone'],
['truck'],
['trumpet'],
['t-shirt'],
['umbrella'],
['underwear'],
['van'],
['vase'],
['violin'],
['washing machine'],
['watermelon'],
['waterslide'],
['whale'],
['wheel'],
['windmill'],
['wine bottle'],
['wine glass'],
['wristwatch'],
['yoga'],
['zebra'],
['zigzag']
];
BEGIN
    FOREACH category_name IN ARRAY category_list LOOP
        EXECUTE FORMAT(
            'INSERT INTO CATEGORIES(category) VALUES (''%s'');',
             category_name
        );
    END LOOP;
END;
$$
LANGUAGE 'plpgsql';

SELECT "create_categories"();

CREATE TABLE Preloaded_Drawings
    (id SERIAL PRIMARY KEY,
     category TEXT NOT NULL,
     drawing_id INT NOT NULL,
     drawing TEXT NOT NULL,
     recognized BOOLEAN NOT NULL DEFAULT TRUE);

CREATE OR REPLACE FUNCTION add_drawing()
    RETURNS trigger AS $add_drawing$
DECLARE
    count TEXT;
    type TEXT;
BEGIN
    IF NEW.recognized THEN
        type = 'recognized';
    ELSE
        type = 'unrecognized';
    END IF;
    EXECUTE FORMAT(
        'SELECT COUNT(*) FROM Preloaded_Drawings
        WHERE category = ''%s''
        AND recognized = ''%s'';',
        NEW.category, NEW.recognized
    ) INTO count;
    EXECUTE FORMAT(
        'UPDATE Categories
         SET %s = %s
         WHERE category = ''%s'';',
         type, count, NEW.category
    );

    RETURN NEW;
END
$add_drawing$ LANGUAGE 'plpgsql';

CREATE TRIGGER add_drawing
AFTER INSERT ON Preloaded_Drawings
FOR EACH ROW
EXECUTE PROCEDURE add_drawing();

CREATE OR REPLACE FUNCTION remove_drawing()
    RETURNS trigger AS $remove_drawing$
DECLARE
    count TEXT;
    type TEXT;
BEGIN
    IF OLD.recognized THEN
        type = 'recognized';
    ELSE
        type = 'unrecognized';
    END IF;
    EXECUTE FORMAT(
        'SELECT COUNT(*) FROM Preloaded_Drawings
        WHERE category = ''%s''
        AND recognized = ''%s'';',
        OLD.category, OLD.recognized
    ) INTO count;
    EXECUTE FORMAT(
        'UPDATE Categories
         SET %s = %s
         WHERE category = ''%s'';',
         type, count, OLD.category
    );

    RETURN OLD;
END
$remove_drawing$ LANGUAGE 'plpgsql';

CREATE TRIGGER remove_drawing
AFTER DELETE ON Preloaded_Drawings
FOR EACH ROW
EXECUTE PROCEDURE remove_drawing();
