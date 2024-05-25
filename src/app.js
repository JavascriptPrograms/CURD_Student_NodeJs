import express from "express";
import bodyParser from "body-parser";
import {conn} from './mysql_database.js';
import flash from "express-flash";
import session from "express-session";

const app = express();

const PORT = process.env.PORT || 3000

app.use(session({ 
    cookie: { maxAge: 60000 },
    store: new session.MemoryStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}))

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.set("view engine","ejs");
app.use(flash());

app.get('/',(req,res)=>{
    const sql = "select * from student";
   conn.query(sql,(err,data)=>{
        if(err){
            console.log(err.message);
        }else{
            res.render('app',{student:data});
        }
   })
    // console.log(student_data);
});

app.get('/add_student',(req,res)=>{
    res.render('add_student')
});

app.post('/submit_student',(req,res)=>{
    try{
        const student_roll_number = req.body.student_roll_number;
        const student_name = req.body.student_name;
        const student_school_name = req.body.student_school_name;
        const student_class = req.body.student_class;
        const student_parents_number = req.body.student_parents_number;
        const student_home_address = req.body.student_home_address;

        if (student_roll_number.length == 0 || student_name.length == 0 ||
             student_school_name.length == 0||
             student_class.length == 0 || student_parents_number.length == 0 || 
             student_home_address.length == 0 ){

            //  const data = {'student_roll_numbe':student_roll_number,'student_name':student_name,
            //  'student_school_name':student_school_name,'student_class':student_class,
            //  'student_parents_number':student_parents_number,'student_home_address':student_home_address}
          
            req.flash('error',"Please enter the valid input !!");
            res.redirect('/add_student');
        }else{
            const sql = "insert into student values('"+student_roll_number+"','"+student_name+"','"+student_school_name+"',\
        '"+student_class+"','"+student_parents_number+"','"+student_home_address+"')";
        console.log(sql);
        conn.query(sql,(err,data)=>{
            if(err){
                console.log(err.message);
            }else{
                console.log(data);
                console.log("inserted the data in database");
                res.redirect('/');
            }
        });   

        }    
    }catch(err){
        console.log(err.message);
    } 
});

app.get("/items_delete/:student_roll_number",(req,res)=>{
    const student_roll_number = req.params.student_roll_number;
    console.log(student_roll_number);
    if (req.params.student_roll_number === undefined){
        req.flash('error',"Something getting error!!");
        res.redirect('/');
    }else{
    const sql = "delete from student where student_roll_number='"+student_roll_number+"'";
    conn.query(sql,(err,result)=>{
        if(err){
            console.log(err.message);
        }else{
            console.log(result);
            console.log("deleted the data from database");
            // setTimeout(()=>{
            // },6000);
            req.flash('success',"deleted the data from database");
            res.redirect("/");
        }
      }); 
    }
});

app.get('/items_edit/:student_roll_number',(req,res)=>{
    const student_roll_number = req.params.student_roll_number;
    const sql = "select * from student where student_roll_number='"+student_roll_number+"'";
    conn.query(sql,(err,result)=>{
        if(err){
            console.log(err.message);
        }else{
            // console.log(result);
            res.render('edit_student',{student:result});
        }
    });
});

app.post('/update_student/:student_roll_number',(req,res)=>{
    const student_roll_number = req.params.student_roll_number;
    const student_name = req.body.student_name;
    const student_school = req.body.student_school_name;
    const student_class = req.body.student_class;
    const student_parents_number = req.body.student_parents_number;
    const student_address = req.body.student_home_address;

    const sql = "update student set student_name='"+student_name+"',student_school='"+student_school+"',\
        student_class='"+student_class+"',student_parents_number='"+student_parents_number+"',student_address='"+student_address+"'\
        where student_roll_number='"+student_roll_number+"'";
        conn.query(sql,(err,result)=>{
            if(err){
                console.log(err.message);
            }else{
                console.log(result);
                console.log("updated the data in database");
                req.flash('success',"updated the data in database");
                res.redirect("/");
            }
    });
    // const data = {'student_roll_numbe':student_roll_number,'student_name':student_name,
    // 'student_school_name':student_school,'student_class':student_class,
    // 'student_parents_number':student_parents_number,'student_home_address':student_address}

});

app.listen(PORT,()=>{
    console.log("Server running is http://localhost:"+PORT);
    
});