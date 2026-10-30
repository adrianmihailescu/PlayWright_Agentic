var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:5174")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

app.UseCors();

// Demo-only storage. Data resets whenever the API process restarts.
var tasks = new List<TaskItem>
{
    new(1, "Generic Task", false),
    new(2, "Specific Task", false)
};
var nextId = 3;

app.MapGet("/", () => Results.Ok(new
{
    name = "Tasks API",
    status = "Running",
    endpoints = new[]
    {
        "GET /api/tasks",
        "POST /api/tasks",
        "PUT /api/tasks/{id}/complete"
    }
}));

app.MapGet("/api/tasks", () => Results.Ok(tasks));

app.MapPost("/api/tasks", (CreateTaskRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.Title))
    {
        return Results.BadRequest(new { error = "Title is required." });
    }

    var task = new TaskItem(nextId++, request.Title.Trim(), false);
    tasks.Add(task);

    return Results.Created($"/api/tasks/{task.Id}", task);
});

app.MapPut("/api/tasks/{id:int}/complete", (int id) =>
{
    var task = tasks.FirstOrDefault(t => t.Id == id);

    if (task is null)
    {
        return Results.NotFound(new { error = "Task not found." });
    }

    task.IsCompleted = true;
    return Results.Ok(task);
});

app.Run();

public sealed class TaskItem(int id, string title, bool isCompleted)
{
    public int Id { get; } = id;
    public string Title { get; } = title;
    public bool IsCompleted { get; set; } = isCompleted;
}

public record CreateTaskRequest(string Title);
