using System;

namespace ChatNg.ChatModels
{
    public class Message
    {
        // chmps
        public string author { get; set; }
        public string status { get; set; }
        public string text { get; set; }
        public DateTime timestamp { get; set; }
    }
}
