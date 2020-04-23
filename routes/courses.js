const {Router} = require('express');
const {validationResult} = require('express-validator');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const {courseValidators} = require('../utils/validators');
const router = Router();

function isOwner(course, req){
    console.log(course.userId.toString(), req.user._id.toString());

   return course.userId.toString() === req.user._id.toString()
}

router.get('/', async (req, res) => {
    try {        
        const courses = await Course.find()
            .lean()
            .populate('userId', 'email name')
            .select('price title img');

        res.render('courses', {
            title: 'Courses',
            isCourses: true,
            userId: req.user ? req.user._id.toString() : null,
            courses,
        });
    } catch (err) {
        console.log(err);
    }
});

router.get('/:id/edit', auth, async (req, res) => {
    try{
        if (!req.query.allow) {
            return res.redirect('/');
        }

        const course = await Course.findById(req.params.id).lean();

        if(!isOwner(course, req)){
            return res.redirect('/courses');
        }

        res.render('course-edit', {
            title: `Edit ${course.title}`,
            course
        })
    } catch(err){
        console.log(err);
    }
});

router.post('/edit', auth, courseValidators, async (req, res) => {
    const errors = validationResult(req);
    const {id} = req.body;
    
    if (!errors.isEmpty()) {
        return res.status(422).redirect(`/courses/${id}/edit?allow=true`)
    }

    try{
        delete req.body.id;
        const course = await Course.findById(id);
        if(!isOwner(course, req)){
            return res.redirect('/courses');
        }
        Object.assign(course, req.body);
        await Course.findByIdAndUpdate(id, req.body).lean();
        res.redirect('/courses');
    } catch(err){
        console.log(err);
    }
   
});

router.post('/remove', auth, async (req, res) => {
    try {
        await Course.deleteOne({
            _id: req.body.id,
            userId: req.body.id
        });
        res.redirect('/courses');
    } catch (err) {
        console.log(err);
    }
})

router.get('/:id', async (req, res) => {
    try{
        const course = await Course.findById(req.params.id).lean();

        res.render('course', {
            layout: 'empty',
            title: `Course: ${course.title}`,
            course
        });
    } catch(err){
        console.log(err);
    }
});

module.exports = router;