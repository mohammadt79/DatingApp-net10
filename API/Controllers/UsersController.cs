using System;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API;

public class UsersController(DataContext context) : BaseApiController
{
    private readonly DataContext _context = context;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
    {
        var users = await _context.Users.ToListAsync();
        return users;
        return Ok(users);
    }

    [HttpGet("{Id:int}")] // api/Id/1 
    public async Task<ActionResult<AppUser>> GetUser(int id)
    {
        var user = _context.Users.Find(id);

        if (user == null) return NotFound();

        return user;

        //return NotFound();
    }
}
